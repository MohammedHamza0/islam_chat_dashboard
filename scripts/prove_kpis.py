import json
import csv
import sys
from collections import Counter
from pathlib import Path

WORKSPACE = Path(r"d:\Midade.Com\islam_chat_dashboard")
ENRICHED_JSON = WORKSPACE / "assets" / "data" / "enriched_qa_dataset.min.json"
DEDUPED_JSON = WORKSPACE / "QA_Extraction_task" / "without duplicate" / "Islam_chat_questions_extraction_deduped.json"
CSV_FILE = WORKSPACE / "QA_Extraction_task" / "Islam_chat_questions_extraction.csv"

csv.field_size_limit(sys.maxsize)

with open(ENRICHED_JSON, "r", encoding="utf-8") as f:
    data = json.load(f)

questions = data.get("questions", [])

print("=== 1. PROOF OF 11,596 QUESTIONS ===")
print(f"Total count in enriched dataset: {len(questions)}")

with open(DEDUPED_JSON, "r", encoding="utf-8") as f:
    deduped_raw = json.load(f)

deduped_count = sum(len(c.get("qa_pairs", [])) for c in deduped_raw.get("results", []))
print(f"Total count in source Islam_chat_questions_extraction_deduped.json: {deduped_count}")

print("\n=== 2. PROOF OF 51 LANGUAGES ===")
langs = Counter(q["language"] for q in questions)
print(f"Unique languages count with QA: {len(langs)}")
print("Top 10 Languages:")
for l, c in langs.most_common(10):
    print(f"  - {l}: {c}")

print("\n=== 3. PROOF OF 3,160 COMPARATIVE RELIGION & DOUBTS ===")
comp_q = [q for q in questions if q["intent_ar"] == "مقارنة أديان ورد شبهات"]
print(f"Total count of comparative & doubts questions: {len(comp_q)} ({len(comp_q)/len(questions)*100:.2f}%)")
print("Sample Comparative Questions:")
for q in comp_q[:4]:
    print(f"  [Chat #{q['conversation_id']}] ({q['topic']}) -> {q['question']}")

print("\n=== 4. PROOF OF 606 TRENDING CLUSTERS ===")
trending_q = [q for q in questions if q["is_trending"]]
print(f"Total unique trending canonical questions (cluster_size > 1): {len(trending_q)}")
print("Sample Trending Questions:")
for q in trending_q[:4]:
    print(f"  [Chat #{q['conversation_id']}] (Cluster size: {q['cluster_size']}) -> {q['question']}")

print("\n=== 5. PROOF OF 20 CONVERSION / SHAHADA REQUESTS ===")
conv_q = [q for q in questions if q["intent_ar"] == "رغبة في اعتناق الإسلام والشهادة"]
print(f"Total conversion/shahada count: {len(conv_q)}")
print("Full List of the 20 Conversion Questions:")
for i, q in enumerate(conv_q, 1):
    print(f"  {i}. [Chat #{q['conversation_id']} - {q['language']}]: {q['question']}")
