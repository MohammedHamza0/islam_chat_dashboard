import sys
import csv
import json
import os
from pathlib import Path

csv.field_size_limit(sys.maxsize)

WORKSPACE = Path(r"d:\Midade.Com\islam_chat_dashboard")
CSV_FILE = WORKSPACE / "QA_Extraction_task" / "Islam_chat_questions_extraction.csv"
ENRICHED_JSON = WORKSPACE / "assets" / "data" / "enriched_qa_dataset.json"
MIN_JSON = WORKSPACE / "assets" / "data" / "enriched_qa_dataset.min.json"
CONV_LOOKUP_JSON = WORKSPACE / "assets" / "data" / "conversations_lookup.json"

print("1. Minifying enriched_qa_dataset.json...")
with open(ENRICHED_JSON, "r", encoding="utf-8") as f:
    data = json.load(f)

with open(MIN_JSON, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, separators=(',', ':'))

print(f"Minified size: {os.path.getsize(MIN_JSON) / (1024*1024):.2f} MB")

print("2. Generating conversations_lookup.json...")
conv_lookup = {}
with open(CSV_FILE, "r", encoding="utf-8", errors="ignore") as f:
    reader = csv.DictReader(f)
    for row in reader:
        cid_str = row.get("general_chat_id") or row.get("\ufeffgeneral_chat_id")
        if not cid_str:
            continue
        try:
            cid = int(cid_str)
            conv_lookup[cid] = {
                "id": cid,
                "start_time": row.get("start_time", ""),
                "language": row.get("conversation_language", "Unknown"),
                "total_msgs": int(row.get("total_messages", 0) or 0),
                "user_msgs": int(row.get("user_msg_count", 0) or 0),
                "bot_msgs": int(row.get("bot_msg_count", 0) or 0),
                "duration": row.get("conversation_duration", ""),
                "full_conversation": row.get("full_conversation", "")
            }
        except Exception:
            continue

with open(CONV_LOOKUP_JSON, "w", encoding="utf-8") as f:
    json.dump(conv_lookup, f, ensure_ascii=False, separators=(',', ':'))

print(f"Conversations lookup size: {os.path.getsize(CONV_LOOKUP_JSON) / (1024*1024):.2f} MB ({len(conv_lookup)} conversations)")
