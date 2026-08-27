import json
from pathlib import Path

WORKSPACE = Path(r"d:\Midade.Com\islam_chat_dashboard")
UNIQUE_JSON = WORKSPACE / "QA_Extraction_task" / "without duplicate" / "Islam_chat_questions_unique.json"
DEDUPED_JSON = WORKSPACE / "QA_Extraction_task" / "without duplicate" / "Islam_chat_questions_extraction_deduped.json"

with open(UNIQUE_JSON, "r", encoding="utf-8") as f:
    u_data = json.load(f)

# Build lookup by (conversation_id, question text)
u_lookup = {}
for q in u_data.get("unique_qa_pairs", []):
    key = (q.get("conversation_id"), q.get("question", "").strip())
    u_lookup[key] = q.get("cluster_size", 1)

with open(DEDUPED_JSON, "r", encoding="utf-8") as f:
    d_data = json.load(f)

matched = 0
trending_count = 0
for conv in d_data.get("results", []):
    cid = conv.get("conversation_id")
    for qa in conv.get("qa_pairs", []):
        key = (cid, qa.get("question", "").strip())
        c_size = u_lookup.get(key, 1)
        if (cid, qa.get("question", "").strip()) in u_lookup:
            matched += 1
        if c_size > 1:
            trending_count += 1

print(f"Total matched: {matched} / 11596")
print(f"Trending questions count with cluster_size > 1: {trending_count}")
