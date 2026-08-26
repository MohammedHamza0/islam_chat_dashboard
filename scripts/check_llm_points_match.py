import json
from pathlib import Path

WORKSPACE = Path(r"D:\Midade.Com\islam_chat_dashboard")
DIR_PATH = WORKSPACE / "LLM point extraction and analysis"
POINTS_JSON = DIR_PATH / "full_conversation_points_extraction.json"
DEDUPED_JSON = WORKSPACE / "QA_Extraction_task" / "without duplicate" / "Islam_chat_questions_extraction_deduped.json"

with open(POINTS_JSON, "r", encoding="utf-8") as f:
    points_raw = json.load(f)

with open(DEDUPED_JSON, "r", encoding="utf-8") as f:
    deduped_raw = json.load(f)

points_lookup = {r["conversation_id"]: r for r in points_raw.get("results", [])}

total_qa = 0
matched_qa = 0

for conv in deduped_raw.get("results", []):
    cid = conv.get("conversation_id")
    qa_list = conv.get("qa_pairs", [])
    total_qa += len(qa_list)
    if cid in points_lookup:
        matched_qa += len(qa_list)

print(f"Total QA pairs: {total_qa}")
print(f"Matched QA pairs with LLM Points Extraction: {matched_qa} ({matched_qa/total_qa*100:.2f}%)")
