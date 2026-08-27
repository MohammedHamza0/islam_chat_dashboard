import json
import csv
import sys
from pathlib import Path

csv.field_size_limit(sys.maxsize)

WORKSPACE = Path(r"d:\Midade.Com\islam_chat_dashboard")
ENRICHED_JSON = WORKSPACE / "assets" / "data" / "enriched_qa_dataset.json"
MIN_JSON = WORKSPACE / "assets" / "data" / "enriched_qa_dataset.min.json"
CSV_CONV = WORKSPACE / "dataset" / "organized_conversations_with_language.csv"
POINTS_JSON = WORKSPACE / "LLM point extraction and analysis" / "full_conversation_points_extraction.json"
LOOKUP_JSON = WORKSPACE / "assets" / "data" / "conversations_lookup.json"
JS_DATA_FILE = WORKSPACE / "assets" / "data" / "enriched_qa_data.js"
JS_CONV_FILE = WORKSPACE / "assets" / "data" / "conversations_data.js"

print("1. Minifying enriched_qa_dataset.json...")
with open(ENRICHED_JSON, "r", encoding="utf-8") as f:
    data = json.load(f)

with open(MIN_JSON, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, separators=(',', ':'))

print(f"Created {MIN_JSON} ({MIN_JSON.stat().st_size / (1024*1024):.2f} MB)")

print("2. Building enriched conversations lookup with AI summaries...")
with open(POINTS_JSON, "r", encoding="utf-8") as f:
    points_raw = json.load(f)
points_lookup = {r["conversation_id"]: r for r in points_raw.get("results", [])}

conv_lookup = {}
with open(CSV_CONV, "r", encoding="utf-8-sig", errors="ignore") as f:
    reader = csv.DictReader(f)
    for row in reader:
        try:
            cid = int(row["general_chat_id"])
            pt = points_lookup.get(cid, {})
            demo = pt.get("user_demographics", {})
            theo = pt.get("theological_profile", {})
            emo = pt.get("emotional_trajectory", {})
            inf = pt.get("intent_and_funnel", {})
            audit = pt.get("bot_quality_audit", {})
            eng = pt.get("engagement_quality", {})

            conv_lookup[cid] = {
                "id": cid,
                "language": row.get("conversation_language", ""),
                "start_time": row.get("start_time", ""),
                "duration": row.get("conversation_duration", ""),
                "total_messages": int(row.get("total_messages", 0)),
                "full_conversation": row.get("full_conversation", ""),
                # LLM Ground Truth Dimensions
                "summary": pt.get("conversation_summary", ""),
                "religion": demo.get("suspected_religion", "Unknown"),
                "is_muslim": demo.get("is_existing_muslim"),
                "intent": inf.get("user_intent", ""),
                "funnel": inf.get("conversion_funnel", "N/A"),
                "key_blocker": theo.get("key_blocker", "N/A"),
                "start_mood": emo.get("start_mood", "Neutral"),
                "end_mood": emo.get("end_mood", "Neutral"),
                "engagement_score": eng.get("engagement_score", 3),
                "response_quality": audit.get("response_quality", 3),
                "bot_critique": audit.get("bot_critique", "")
            }
        except Exception:
            continue

with open(LOOKUP_JSON, "w", encoding="utf-8") as f:
    json.dump(conv_lookup, f, ensure_ascii=False)

print(f"Created {LOOKUP_JSON} ({LOOKUP_JSON.stat().st_size / (1024*1024):.2f} MB)")

print("3. Generating direct JS data files (zero CORS issue on file:///)...")
with open(MIN_JSON, "r", encoding="utf-8") as f:
    raw_qa_json = f.read()

with open(JS_DATA_FILE, "w", encoding="utf-8") as f:
    f.write("window.ENRICHED_QA_DATASET = " + raw_qa_json + ";")

print(f"Created {JS_DATA_FILE} ({JS_DATA_FILE.stat().st_size / (1024*1024):.2f} MB)")

with open(LOOKUP_JSON, "r", encoding="utf-8") as f:
    raw_conv_json = f.read()

with open(JS_CONV_FILE, "w", encoding="utf-8") as f:
    f.write("window.CONVERSATIONS_LOOKUP = " + raw_conv_json + ";")

print(f"Created {JS_CONV_FILE} ({JS_CONV_FILE.stat().st_size / (1024*1024):.2f} MB)")
