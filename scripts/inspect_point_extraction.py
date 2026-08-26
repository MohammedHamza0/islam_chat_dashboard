import json
import csv
import sys
from pathlib import Path

csv.field_size_limit(sys.maxsize)

DIR_PATH = Path(r"D:\Midade.Com\islam_chat_dashboard\LLM point extraction and analysis")
JSON_PATH = DIR_PATH / "full_conversation_points_extraction.json"
CSV_PATH = DIR_PATH / "full_conversation_points_extraction.csv"

print("1. Inspecting full_conversation_points_extraction.json...")
with open(JSON_PATH, "r", encoding="utf-8") as f:
    data_json = json.load(f)

print(f"Type of JSON root: {type(data_json)}")
if isinstance(data_json, dict):
    print("Keys in root:", list(data_json.keys()))
    print("Metadata:", data_json.get("metadata"))
    results = data_json.get("results", [])
    print(f"Total results: {len(results)}")
    if results:
        sample = next((r for r in results if r.get("conversation_points")), results[0])
        print("\nSample result keys:", list(sample.keys()))
        print("Sample result preview:")
        print(json.dumps(sample, ensure_ascii=False, indent=2)[:800])
elif isinstance(data_json, list):
    print(f"List length: {len(data_json)}")
    if data_json:
        print("Sample element keys:", list(data_json[0].keys()))
        print("Sample element preview:")
        print(json.dumps(data_json[0], ensure_ascii=False, indent=2)[:800])

print("\n2. Inspecting full_conversation_points_extraction.csv...")
with open(CSV_PATH, "r", encoding="utf-8", errors="ignore") as f:
    reader = csv.reader(f)
    headers = next(reader)
    print("CSV Headers:", headers)
    first_row = next(reader)
    for h, v in zip(headers, first_row):
        if h not in ['full_conversation', 'all_user_messages', 'all_bot_messages']:
            print(f"  {h}: {v[:80] if len(v) > 80 else v}")
