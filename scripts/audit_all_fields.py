import json
from collections import Counter
from pathlib import Path

WORKSPACE = Path(r"d:\Midade.Com\islam_chat_dashboard")
MIN_JSON = WORKSPACE / "assets" / "data" / "enriched_qa_dataset.min.json"

with open(MIN_JSON, "r", encoding="utf-8") as f:
    data = json.load(f)

questions = data.get("questions", [])

print("=== FULL AUDIT OF ALL ATTRIBUTES ===")
print(f"Total Questions: {len(questions)}")

# Check nulls or fallback values in each field
fields = list(questions[0].keys())
for fld in fields:
    vals = [q.get(fld) for q in questions]
    null_count = sum(1 for v in vals if v is None or v == "")
    unique_count = len(set(str(v) for v in vals))
    print(f"Field: {fld:<20} | Nulls/Empty: {null_count:<5} | Unique Values: {unique_count}")

print("\n--- Region Mapping Inspection ---")
c_region = Counter(q["region_ar"] for q in questions)
for k, v in c_region.items():
    print(f"  {k}: {v}")

print("\n--- Language Inspection ---")
c_lang = Counter(q["language"] for q in questions)
print("Top 10 languages:", c_lang.most_common(10))
