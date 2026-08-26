import sys
import json
from pathlib import Path

WORKSPACE = Path(r"d:\Midade.Com\islam_chat_dashboard")
MIN_JSON = WORKSPACE / "assets" / "data" / "enriched_qa_dataset.min.json"
CONV_JSON = WORKSPACE / "assets" / "data" / "conversations_lookup.json"

JS_DATA_FILE = WORKSPACE / "assets" / "data" / "enriched_qa_data.js"
JS_CONV_FILE = WORKSPACE / "assets" / "data" / "conversations_data.js"

print("1. Creating enriched_qa_data.js...")
with open(MIN_JSON, "r", encoding="utf-8") as f:
    raw_qa_json = f.read()

with open(JS_DATA_FILE, "w", encoding="utf-8") as f:
    f.write("window.ENRICHED_QA_DATASET = " + raw_qa_json + ";")

print(f"Created {JS_DATA_FILE} ({JS_DATA_FILE.stat().st_size / (1024*1024):.2f} MB)")

print("2. Creating conversations_data.js...")
with open(CONV_JSON, "r", encoding="utf-8") as f:
    raw_conv_json = f.read()

with open(JS_CONV_FILE, "w", encoding="utf-8") as f:
    f.write("window.CONVERSATIONS_LOOKUP = " + raw_conv_json + ";")

print(f"Created {JS_CONV_FILE} ({JS_CONV_FILE.stat().st_size / (1024*1024):.2f} MB)")
