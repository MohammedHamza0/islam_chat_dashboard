import json
from pathlib import Path

WORKSPACE = Path(r"d:\Midade.Com\islam_chat_dashboard")
UNIQUE_JSON = WORKSPACE / "QA_Extraction_task" / "without duplicate" / "Islam_chat_questions_unique.json"
DEDUPED_JSON = WORKSPACE / "QA_Extraction_task" / "without duplicate" / "Islam_chat_questions_extraction_deduped.json"

with open(UNIQUE_JSON, "r", encoding="utf-8") as f:
    u_data = json.load(f)

u_list = u_data.get("unique_qa_pairs", [])
print(f"Unique questions count: {len(u_list)}")
sample_u = [q for q in u_list if q.get("cluster_size", 1) > 1]
print(f"Unique questions with cluster_size > 1: {len(sample_u)}")
if sample_u:
    print("Sample unique trending:", sample_u[0].get("question"), "Cluster size:", sample_u[0].get("cluster_size"))

with open(DEDUPED_JSON, "r", encoding="utf-8") as f:
    d_data = json.load(f)

d_qa_with_cluster = 0
for conv in d_data.get("results", []):
    for qa in conv.get("qa_pairs", []):
        if qa.get("cluster_size", 1) > 1:
            d_qa_with_cluster += 1

print(f"In Islam_chat_questions_extraction_deduped.json, qa with cluster_size > 1: {d_qa_with_cluster}")
