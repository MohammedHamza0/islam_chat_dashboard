#!/usr/bin/env python
"""Deduplicate extracted Islam chat questions.

The duplicate decision is based on question text only. Answers are preserved
and the canonical record for each duplicate group is chosen by richest answer.
"""

from __future__ import annotations

import argparse
import csv
import json
import math
import re
import time
import unicodedata
import urllib.error
import urllib.request
from collections import Counter, defaultdict
from copy import deepcopy
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any

import numpy as np
from rapidfuzz import fuzz
from sklearn.neighbors import NearestNeighbors


@dataclass(frozen=True)
class QARecord:
    id: int
    conversation_id: Any
    conversation_index: int
    qa_index: int
    question_number: Any
    question: str
    normalized_question: str
    answer: str
    topic_category: Any
    is_follow_up: Any

    @property
    def answer_richness(self) -> int:
        return len(re.sub(r"\s+", "", self.answer or ""))


class UnionFind:
    def __init__(self, size: int) -> None:
        self.parent = list(range(size))
        self.rank = [0] * size

    def find(self, item: int) -> int:
        while self.parent[item] != item:
            self.parent[item] = self.parent[self.parent[item]]
            item = self.parent[item]
        return item

    def union(self, left: int, right: int) -> bool:
        root_left = self.find(left)
        root_right = self.find(right)
        if root_left == root_right:
            return False
        if self.rank[root_left] < self.rank[root_right]:
            root_left, root_right = root_right, root_left
        self.parent[root_right] = root_left
        if self.rank[root_left] == self.rank[root_right]:
            self.rank[root_left] += 1
        return True


def normalize_question(text: str) -> str:
    text = unicodedata.normalize("NFKC", text or "")
    text = text.casefold().strip()
    text = re.sub(r"[^\w\s]", " ", text, flags=re.UNICODE)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def tokenize_normalized(text: str) -> list[str]:
    return [token for token in text.split() if len(token) > 2]


QUESTION_STARTERS = {
    "what",
    "who",
    "when",
    "where",
    "why",
    "how",
    "does",
    "did",
    "is",
    "are",
    "can",
    "could",
    "should",
    "would",
}


CONTENT_STOP_WORDS = {
    "what",
    "who",
    "when",
    "where",
    "why",
    "how",
    "the",
    "and",
    "are",
    "was",
    "were",
    "does",
    "did",
    "can",
    "could",
    "would",
    "should",
    "about",
    "according",
    "regarding",
    "explain",
    "tell",
    "mean",
    "means",
    "meaning",
}


def question_starter(normalized_question: str) -> str:
    for token in normalized_question.split():
        if token in QUESTION_STARTERS:
            return token
    return ""


def content_tokens(normalized_question: str) -> set[str]:
    return {
        token
        for token in tokenize_normalized(normalized_question)
        if token not in CONTENT_STOP_WORDS
    }


def semantic_compatible(left: QARecord, right: QARecord) -> tuple[bool, str, dict[str, float]]:
    left_starter = question_starter(left.normalized_question)
    right_starter = question_starter(right.normalized_question)
    if left_starter and right_starter and left_starter != right_starter:
        return False, "different_question_starter", {}

    left_tokens = content_tokens(left.normalized_question)
    right_tokens = content_tokens(right.normalized_question)
    if not left_tokens or not right_tokens:
        return False, "missing_content_tokens", {}

    shared = left_tokens & right_tokens
    union = left_tokens | right_tokens
    smaller = min(len(left_tokens), len(right_tokens))
    larger = max(len(left_tokens), len(right_tokens))
    jaccard = len(shared) / len(union)
    overlap_smaller = len(shared) / smaller
    length_ratio = min(len(left.normalized_question), len(right.normalized_question)) / max(
        len(left.normalized_question),
        len(right.normalized_question),
    )
    token_set = float(fuzz.token_set_ratio(left.normalized_question, right.normalized_question))

    metrics = {
        "compat_jaccard": jaccard,
        "compat_overlap_smaller": overlap_smaller,
        "compat_length_ratio": length_ratio,
        "compat_token_set_ratio": token_set,
    }

    if token_set < 88.0:
        return False, "low_token_set_ratio", metrics
    if jaccard < 0.50 and overlap_smaller < 0.86:
        return False, "low_content_overlap", metrics
    if length_ratio < 0.62:
        return False, "large_length_difference", metrics

    extra_count = larger - smaller
    if smaller <= 3 and extra_count >= 2:
        return False, "short_question_compound_expansion", metrics
    if smaller <= 5 and extra_count >= 4:
        return False, "compound_expansion", metrics

    return True, "compatible", metrics


def read_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def write_json(path: Path, payload: Any) -> None:
    with path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, ensure_ascii=False, indent=2)


def flatten_records(data: dict[str, Any]) -> list[QARecord]:
    records: list[QARecord] = []
    for conversation_index, conversation in enumerate(data.get("results", [])):
        for qa_index, qa_pair in enumerate(conversation.get("qa_pairs", []) or []):
            question = (qa_pair.get("question") or "").strip()
            if not question:
                continue
            answer = (qa_pair.get("answer") or "").strip()
            records.append(
                QARecord(
                    id=len(records),
                    conversation_id=conversation.get("conversation_id"),
                    conversation_index=conversation_index,
                    qa_index=qa_index,
                    question_number=qa_pair.get("question_number"),
                    question=question,
                    normalized_question=normalize_question(question),
                    answer=answer,
                    topic_category=qa_pair.get("topic_category"),
                    is_follow_up=qa_pair.get("is_follow_up"),
                )
            )
    return records


def choose_canonical(record_ids: list[int], records: list[QARecord]) -> int:
    return max(
        record_ids,
        key=lambda idx: (
            records[idx].answer_richness,
            len(records[idx].answer or ""),
            -records[idx].id,
        ),
    )


def add_edge(
    edges: list[dict[str, Any]],
    left: int,
    right: int,
    reason: str,
    score: float | None = None,
    extra: dict[str, Any] | None = None,
) -> None:
    payload = {
        "left_id": min(left, right),
        "right_id": max(left, right),
        "reason": reason,
        "score": score,
    }
    if extra:
        payload.update(extra)
    edges.append(payload)


def merge_exact(records: list[QARecord], uf: UnionFind, edges: list[dict[str, Any]]) -> int:
    groups: dict[str, list[int]] = defaultdict(list)
    for record in records:
        groups[record.normalized_question].append(record.id)

    merge_count = 0
    for normalized, ids in groups.items():
        if normalized and len(ids) > 1:
            anchor = ids[0]
            for other in ids[1:]:
                if uf.union(anchor, other):
                    merge_count += 1
                add_edge(edges, anchor, other, "normalized_exact", 1.0)
    return merge_count


def merge_fuzzy(
    records: list[QARecord],
    uf: UnionFind,
    edges: list[dict[str, Any]],
    threshold: float,
    max_posting_size: int,
) -> int:
    stop_words = {
        "what",
        "who",
        "when",
        "where",
        "why",
        "how",
        "the",
        "and",
        "are",
        "was",
        "were",
        "does",
        "did",
        "can",
        "could",
        "would",
        "should",
        "islam",
        "islamic",
        "muslim",
    }
    token_postings: dict[str, list[int]] = defaultdict(list)
    token_counts: Counter[str] = Counter()
    record_tokens: list[list[str]] = []

    for record in records:
        tokens = sorted(set(tokenize_normalized(record.normalized_question)))
        record_tokens.append(tokens)
        token_counts.update(token for token in tokens if token not in stop_words)

    for record_id, tokens in enumerate(record_tokens):
        for token in tokens:
            if token not in stop_words and token_counts[token] <= max_posting_size:
                token_postings[token].append(record_id)

    seen_pairs: set[tuple[int, int]] = set()
    merge_count = 0
    for record in records:
        tokens = [
            token
            for token in record_tokens[record.id]
            if token not in stop_words and token_counts[token] <= max_posting_size
        ]
        rare_tokens = sorted(tokens, key=lambda token: token_counts[token])[:6]
        candidates: set[int] = set()
        for token in rare_tokens:
            candidates.update(token_postings[token])

        left_len = max(len(record.normalized_question), 1)
        for candidate_id in candidates:
            if candidate_id <= record.id:
                continue
            pair = (record.id, candidate_id)
            if pair in seen_pairs:
                continue
            seen_pairs.add(pair)
            other = records[candidate_id]
            right_len = max(len(other.normalized_question), 1)
            if min(left_len, right_len) / max(left_len, right_len) < 0.65:
                continue
            score = float(fuzz.token_set_ratio(record.normalized_question, other.normalized_question))
            if score >= threshold:
                if uf.union(record.id, candidate_id):
                    merge_count += 1
                add_edge(edges, record.id, candidate_id, "fuzzy_token_set", score)
    return merge_count


def ollama_embed_batch(
    texts: list[str],
    model: str,
    url: str,
    timeout: int,
) -> list[list[float]]:
    body = json.dumps({"model": model, "input": texts, "keep_alive": "30m"}).encode("utf-8")
    request = urllib.request.Request(
        url,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        payload = json.load(response)
    embeddings = payload.get("embeddings")
    if not isinstance(embeddings, list) or len(embeddings) != len(texts):
        raise RuntimeError(f"Unexpected Ollama embedding response for {len(texts)} texts")
    return embeddings


def build_embeddings(
    records: list[QARecord],
    model: str,
    url: str,
    batch_size: int,
    timeout: int,
) -> np.ndarray:
    all_embeddings: list[list[float]] = []
    total = len(records)
    for start in range(0, total, batch_size):
        batch = records[start : start + batch_size]
        texts = [f"clustering: {record.question}" for record in batch]
        embeddings = ollama_embed_batch(texts, model=model, url=url, timeout=timeout)
        all_embeddings.extend(embeddings)
        print(f"Embedded {min(start + batch_size, total):,}/{total:,} questions")
    matrix = np.asarray(all_embeddings, dtype=np.float32)
    norms = np.linalg.norm(matrix, axis=1, keepdims=True)
    norms[norms == 0] = 1.0
    return matrix / norms


def embedding_candidate_pairs(
    records: list[QARecord],
    embeddings: np.ndarray,
    uf: UnionFind,
    top_k: int,
    min_cosine: float,
    max_pairs: int,
    review_candidates: list[dict[str, Any]],
) -> tuple[list[dict[str, Any]], int]:
    if len(embeddings) < 2:
        return [], 0

    neighbor_count = min(top_k + 1, len(embeddings))
    nn = NearestNeighbors(n_neighbors=neighbor_count, metric="cosine", algorithm="brute")
    nn.fit(embeddings)
    distances, indices = nn.kneighbors(embeddings)

    best_by_pair: dict[tuple[int, int], float] = {}
    rejected_count = 0
    for left_id, neighbor_ids in enumerate(indices):
        for distance, right_id in zip(distances[left_id], neighbor_ids):
            right_id = int(right_id)
            if left_id == right_id:
                continue
            left_root = uf.find(left_id)
            right_root = uf.find(right_id)
            if left_root == right_root:
                continue
            cosine = 1.0 - float(distance)
            if cosine < min_cosine:
                continue
            pair = (min(left_id, right_id), max(left_id, right_id))
            compatible, reject_reason, metrics = semantic_compatible(records[pair[0]], records[pair[1]])
            if not compatible:
                rejected_count += 1
                if cosine >= 0.90:
                    review_candidates.append(
                        {
                            "left_id": pair[0],
                            "right_id": pair[1],
                            "embedding_cosine": cosine,
                            "reranker_score_lr": None,
                            "reranker_score_rl": None,
                            "reranker_score_min": None,
                            "reranker_score_avg": None,
                            "review_reason": f"embedding_candidate_rejected_{reject_reason}",
                            **metrics,
                        }
                    )
                continue
            if cosine > best_by_pair.get(pair, -1.0):
                best_by_pair[pair] = cosine

    candidates = [
        {"left_id": left, "right_id": right, "embedding_cosine": cosine}
        for (left, right), cosine in best_by_pair.items()
    ]
    candidates.sort(key=lambda item: item["embedding_cosine"], reverse=True)
    if max_pairs > 0:
        candidates = candidates[:max_pairs]
    return candidates, rejected_count


def resolve_reranker_path(path_arg: str | None) -> str:
    if path_arg:
        return path_arg
    cache_root = Path.home() / ".cache" / "huggingface" / "hub" / "models--BAAI--bge-reranker-v2-m3" / "snapshots"
    if cache_root.exists():
        snapshots = sorted(cache_root.iterdir(), key=lambda path: path.stat().st_mtime, reverse=True)
        for snapshot in snapshots:
            if (snapshot / "config.json").exists():
                return str(snapshot)
    return "BAAI/bge-reranker-v2-m3"


def rerank_pairs(
    records: list[QARecord],
    candidates: list[dict[str, Any]],
    uf: UnionFind,
    edges: list[dict[str, Any]],
    review_candidates: list[dict[str, Any]],
    model_path: str,
    batch_size: int,
    merge_threshold: float,
    review_threshold: float,
    max_length: int,
) -> int:
    import torch
    from transformers import AutoModelForSequenceClassification, AutoTokenizer

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Loading BGE reranker from {model_path} on {device}")
    tokenizer = AutoTokenizer.from_pretrained(model_path, local_files_only=Path(model_path).exists())
    model = AutoModelForSequenceClassification.from_pretrained(
        model_path,
        local_files_only=Path(model_path).exists(),
    )
    model.to(device)
    model.eval()

    merge_count = 0
    total = len(candidates)
    for start in range(0, total, batch_size):
        batch_candidates = candidates[start : start + batch_size]
        directed_pairs: list[tuple[str, str]] = []
        for candidate in batch_candidates:
            left = records[candidate["left_id"]].question
            right = records[candidate["right_id"]].question
            directed_pairs.append((left, right))
            directed_pairs.append((right, left))

        with torch.no_grad():
            encoded = tokenizer(
                [left for left, _ in directed_pairs],
                [right for _, right in directed_pairs],
                padding=True,
                truncation=True,
                max_length=max_length,
                return_tensors="pt",
            )
            encoded = {key: value.to(device) for key, value in encoded.items()}
            logits = model(**encoded, return_dict=True).logits.view(-1).float()
            scores = torch.sigmoid(logits).detach().cpu().numpy()

        for offset, candidate in enumerate(batch_candidates):
            left_id = candidate["left_id"]
            right_id = candidate["right_id"]
            score_lr = float(scores[offset * 2])
            score_rl = float(scores[offset * 2 + 1])
            min_score = min(score_lr, score_rl)
            avg_score = (score_lr + score_rl) / 2.0
            extra = {
                "embedding_cosine": candidate["embedding_cosine"],
                "reranker_score_lr": score_lr,
                "reranker_score_rl": score_rl,
                "reranker_score_min": min_score,
                "reranker_score_avg": avg_score,
            }
            if min_score >= merge_threshold:
                if uf.union(left_id, right_id):
                    merge_count += 1
                add_edge(edges, left_id, right_id, "bge_reranker_semantic", min_score, extra)
            elif min_score >= review_threshold:
                review_candidates.append(
                    {
                        "left_id": left_id,
                        "right_id": right_id,
                        **extra,
                    }
                )

        print(f"Reranked {min(start + batch_size, total):,}/{total:,} candidate pairs")
    return merge_count


def group_records(records: list[QARecord], uf: UnionFind) -> dict[int, list[int]]:
    groups: dict[int, list[int]] = defaultdict(list)
    for record in records:
        groups[uf.find(record.id)].append(record.id)
    return groups


def summarize_edge_map(edges: list[dict[str, Any]]) -> dict[tuple[int, int], list[dict[str, Any]]]:
    by_pair: dict[tuple[int, int], list[dict[str, Any]]] = defaultdict(list)
    for edge in edges:
        pair = (edge["left_id"], edge["right_id"])
        by_pair[pair].append(edge)
    return by_pair


def write_unique_outputs(
    output_dir: Path,
    data: dict[str, Any],
    records: list[QARecord],
    groups: dict[int, list[int]],
    edges: list[dict[str, Any]],
    review_candidates: list[dict[str, Any]],
    stats: dict[str, Any],
) -> None:
    edge_map = summarize_edge_map(edges)
    canonical_by_record: dict[int, int] = {}
    unique_rows: list[dict[str, Any]] = []
    duplicate_cluster_rows: list[dict[str, Any]] = []

    for cluster_number, ids in enumerate(sorted(groups.values(), key=lambda group: min(group)), start=1):
        canonical_id = choose_canonical(ids, records)
        canonical = records[canonical_id]
        for record_id in ids:
            canonical_by_record[record_id] = canonical_id

        duplicate_sources = []
        cluster_edges = [
            edge
            for pair, pair_edges in edge_map.items()
            if pair[0] in ids and pair[1] in ids
            for edge in pair_edges
        ]
        match_reasons = sorted({edge["reason"] for edge in cluster_edges})
        max_embedding = max(
            [edge.get("embedding_cosine") for edge in cluster_edges if edge.get("embedding_cosine") is not None],
            default=None,
        )
        max_reranker = max(
            [edge.get("reranker_score_min") for edge in cluster_edges if edge.get("reranker_score_min") is not None],
            default=None,
        )

        for record_id in ids:
            record = records[record_id]
            source_payload = {
                "record_id": record.id,
                "conversation_id": record.conversation_id,
                "question_number": record.question_number,
                "question": record.question,
                "answer": record.answer,
                "topic_category": record.topic_category,
                "is_canonical": record_id == canonical_id,
            }
            duplicate_sources.append(source_payload)
            if len(ids) > 1:
                duplicate_cluster_rows.append(
                    {
                        "cluster_id": cluster_number,
                        "record_id": record.id,
                        "is_canonical": record_id == canonical_id,
                        "canonical_record_id": canonical_id,
                        "conversation_id": record.conversation_id,
                        "question_number": record.question_number,
                        "question": record.question,
                        "answer": record.answer,
                        "topic_category": record.topic_category,
                        "answer_richness": record.answer_richness,
                        "cluster_size": len(ids),
                        "match_reasons": "|".join(match_reasons),
                        "max_embedding_cosine": max_embedding,
                        "max_reranker_score_min": max_reranker,
                    }
                )

        unique_rows.append(
            {
                "record_id": canonical.id,
                "conversation_id": canonical.conversation_id,
                "question_number": canonical.question_number,
                "question": canonical.question,
                "normalized_question": canonical.normalized_question,
                "answer": canonical.answer,
                "topic_category": canonical.topic_category,
                "is_follow_up": canonical.is_follow_up,
                "answer_richness": canonical.answer_richness,
                "duplicate_count": len(ids) - 1,
                "cluster_size": len(ids),
                "match_reasons": match_reasons,
                "max_embedding_cosine": max_embedding,
                "max_reranker_score_min": max_reranker,
                "duplicate_sources": duplicate_sources,
            }
        )

    unique_json = {
        "metadata": {
            **data.get("metadata", {}),
            "dedupe_generated_at": datetime.now().isoformat(timespec="seconds"),
            **stats,
        },
        "unique_qa_pairs": unique_rows,
    }
    write_json(output_dir / "Islam_chat_questions_unique.json", unique_json)

    write_flat_csv(output_dir / "Islam_chat_questions_unique.csv", unique_rows)
    write_flat_csv(output_dir / "Islam_chat_questions_duplicate_clusters.csv", duplicate_cluster_rows)
    write_review_csv(output_dir / "Islam_chat_questions_review_candidates.csv", review_candidates, records)
    write_deduped_original_json(
        output_dir / "Islam_chat_questions_extraction_deduped.json",
        data,
        records,
        set(canonical_by_record.values()),
        stats,
    )


def write_flat_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    fieldnames = [
        "cluster_id",
        "record_id",
        "conversation_id",
        "question_number",
        "question",
        "normalized_question",
        "answer",
        "topic_category",
        "is_follow_up",
        "answer_richness",
        "duplicate_count",
        "cluster_size",
        "match_reasons",
        "max_embedding_cosine",
        "max_reranker_score_min",
        "is_canonical",
        "canonical_record_id",
    ]
    present_fieldnames = [field for field in fieldnames if any(field in row for row in rows)]
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=present_fieldnames, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            csv_row = dict(row)
            if isinstance(csv_row.get("match_reasons"), list):
                csv_row["match_reasons"] = "|".join(csv_row["match_reasons"])
            writer.writerow(csv_row)


def write_review_csv(path: Path, rows: list[dict[str, Any]], records: list[QARecord]) -> None:
    fieldnames = [
        "left_id",
        "right_id",
        "left_conversation_id",
        "right_conversation_id",
        "left_question",
        "right_question",
        "embedding_cosine",
        "reranker_score_lr",
        "reranker_score_rl",
        "reranker_score_min",
        "reranker_score_avg",
        "review_reason",
        "compat_jaccard",
        "compat_overlap_smaller",
        "compat_length_ratio",
        "compat_token_set_ratio",
    ]
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            left = records[row["left_id"]]
            right = records[row["right_id"]]
            writer.writerow(
                {
                    **row,
                    "left_conversation_id": left.conversation_id,
                    "right_conversation_id": right.conversation_id,
                    "left_question": left.question,
                    "right_question": right.question,
                }
            )


def write_deduped_original_json(
    path: Path,
    data: dict[str, Any],
    records: list[QARecord],
    canonical_ids: set[int],
    stats: dict[str, Any],
) -> None:
    record_id_by_position = {
        (record.conversation_index, record.qa_index): record.id
        for record in records
    }
    cleaned = deepcopy(data)
    for conversation_index, conversation in enumerate(cleaned.get("results", [])):
        old_pairs = conversation.get("qa_pairs", []) or []
        new_pairs = []
        for qa_index, qa_pair in enumerate(old_pairs):
            record_id = record_id_by_position.get((conversation_index, qa_index))
            if record_id in canonical_ids:
                new_pairs.append(deepcopy(qa_pair))
        for question_number, qa_pair in enumerate(new_pairs, start=1):
            qa_pair["question_number"] = question_number
        conversation["qa_pairs"] = new_pairs
        conversation["total_questions"] = len(new_pairs)
        conversation["has_questions"] = bool(new_pairs)

    metadata = cleaned.setdefault("metadata", {})
    metadata["dedupe_generated_at"] = datetime.now().isoformat(timespec="seconds")
    metadata.update(stats)
    metadata["total_qa_pairs_extracted"] = stats["unique_qa_pairs"]
    write_json(path, cleaned)


def smoke_test_ollama(args: argparse.Namespace) -> None:
    texts = [
        "clustering: What is Islam?",
        "clustering: What is the religion of Islam?",
        "clustering: Who is Allah?",
    ]
    embeddings = ollama_embed_batch(texts, args.embedding_model, args.ollama_embed_url, args.ollama_timeout)
    print(f"Ollama smoke test: {len(embeddings)} embeddings, dimension {len(embeddings[0])}")


def smoke_test_reranker(args: argparse.Namespace) -> None:
    import torch
    from transformers import AutoModelForSequenceClassification, AutoTokenizer

    model_path = resolve_reranker_path(args.reranker_model_path)
    tokenizer = AutoTokenizer.from_pretrained(model_path, local_files_only=Path(model_path).exists())
    model = AutoModelForSequenceClassification.from_pretrained(
        model_path,
        local_files_only=Path(model_path).exists(),
    )
    model.eval()
    pairs = [
        ("What is Islam?", "What is the religion of Islam?"),
        ("What is Islam?", "Who is Allah?"),
    ]
    with torch.no_grad():
        encoded = tokenizer(
            [left for left, _ in pairs],
            [right for _, right in pairs],
            padding=True,
            truncation=True,
            max_length=args.reranker_max_length,
            return_tensors="pt",
        )
        logits = model(**encoded, return_dict=True).logits.view(-1).float()
        scores = torch.sigmoid(logits).tolist()
    print("BGE reranker smoke test:")
    for pair, score in zip(pairs, scores):
        print(f"  {pair[0]!r} <> {pair[1]!r}: sigmoid={score:.4f}")


def parse_args() -> argparse.Namespace:
    script_dir = Path(__file__).resolve().parent
    default_input = script_dir.parent / "Islam_chat_questions_extraction.json"
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=default_input)
    parser.add_argument("--output-dir", type=Path, default=script_dir)
    parser.add_argument("--embedding-model", default="nomic-embed-text-v1.5:latest")
    parser.add_argument("--ollama-embed-url", default="http://localhost:11434/api/embed")
    parser.add_argument("--ollama-timeout", type=int, default=120)
    parser.add_argument("--embedding-batch-size", type=int, default=128)
    parser.add_argument("--embedding-top-k", type=int, default=12)
    parser.add_argument("--embedding-min-cosine", type=float, default=0.82)
    parser.add_argument("--max-semantic-pairs", type=int, default=30000)
    parser.add_argument("--fuzzy-threshold", type=float, default=96.0)
    parser.add_argument("--fuzzy-max-posting-size", type=int, default=500)
    parser.add_argument("--reranker-model-path", default=None)
    parser.add_argument("--reranker-batch-size", type=int, default=12)
    parser.add_argument("--reranker-max-length", type=int, default=256)
    parser.add_argument("--reranker-merge-threshold", type=float, default=0.985)
    parser.add_argument("--reranker-review-threshold", type=float, default=0.90)
    parser.add_argument("--skip-embeddings", action="store_true")
    parser.add_argument("--skip-reranker", action="store_true")
    parser.add_argument("--smoke-test", action="store_true")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)

    if args.smoke_test:
        smoke_test_ollama(args)
        smoke_test_reranker(args)
        return

    started_at = time.time()
    data = read_json(args.input)
    records = flatten_records(data)
    print(f"Loaded {len(records):,} Q&A records from {args.input}")

    uf = UnionFind(len(records))
    edges: list[dict[str, Any]] = []
    review_candidates: list[dict[str, Any]] = []
    embedding_rejected_pairs = 0

    exact_merges = merge_exact(records, uf, edges)
    print(f"Normalized exact merges: {exact_merges:,}")

    fuzzy_merges = merge_fuzzy(
        records,
        uf,
        edges,
        threshold=args.fuzzy_threshold,
        max_posting_size=args.fuzzy_max_posting_size,
    )
    print(f"Fuzzy syntax merges: {fuzzy_merges:,}")

    semantic_candidates: list[dict[str, Any]] = []
    semantic_merges = 0
    if not args.skip_embeddings:
        embeddings = build_embeddings(
            records,
            model=args.embedding_model,
            url=args.ollama_embed_url,
            batch_size=args.embedding_batch_size,
            timeout=args.ollama_timeout,
        )
        semantic_candidates, embedding_rejected_pairs = embedding_candidate_pairs(
            records,
            embeddings,
            uf,
            top_k=args.embedding_top_k,
            min_cosine=args.embedding_min_cosine,
            max_pairs=args.max_semantic_pairs,
            review_candidates=review_candidates,
        )
        print(f"Embedding candidate pairs for reranker: {len(semantic_candidates):,}")
        print(f"Embedding candidates rejected before reranker: {embedding_rejected_pairs:,}")

    if semantic_candidates and not args.skip_reranker:
        semantic_merges = rerank_pairs(
            records,
            semantic_candidates,
            uf,
            edges,
            review_candidates,
            model_path=resolve_reranker_path(args.reranker_model_path),
            batch_size=args.reranker_batch_size,
            merge_threshold=args.reranker_merge_threshold,
            review_threshold=args.reranker_review_threshold,
            max_length=args.reranker_max_length,
        )
        print(f"BGE semantic merges: {semantic_merges:,}")

    groups = group_records(records, uf)
    duplicate_groups = sum(1 for ids in groups.values() if len(ids) > 1)
    unique_count = len(groups)
    removed_count = len(records) - unique_count
    stats = {
        "input_qa_pairs": len(records),
        "unique_qa_pairs": unique_count,
        "removed_duplicate_qa_pairs": removed_count,
        "duplicate_cluster_count": duplicate_groups,
        "normalized_exact_merges": exact_merges,
        "fuzzy_syntax_merges": fuzzy_merges,
        "embedding_candidate_pairs": len(semantic_candidates),
        "embedding_rejected_pairs_before_reranker": embedding_rejected_pairs,
        "bge_semantic_merges": semantic_merges,
        "review_candidate_pairs": len(review_candidates),
        "dedupe_seconds": round(time.time() - started_at, 2),
        "dedupe_question_basis": "question_text_only",
        "canonical_selection": "richest_answer_wins",
    }

    if len(records) != unique_count + removed_count:
        raise RuntimeError("Count validation failed")

    write_unique_outputs(
        args.output_dir,
        data,
        records,
        groups,
        edges,
        review_candidates,
        stats,
    )

    print("Done.")
    for key, value in stats.items():
        print(f"{key}: {value}")


if __name__ == "__main__":
    main()
