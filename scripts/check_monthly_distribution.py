import json
from collections import Counter

with open(r"d:\Midade.Com\islam_chat_dashboard\assets\data\enriched_qa_dataset.min.json", "r", encoding="utf-8") as f:
    data = json.load(f)

questions = data.get("questions", [])

month_keys = [
    ("2024-10", "أكتوبر 24"),
    ("2024-11", "نوفمبر 24"),
    ("2024-12", "ديسمبر 24"),
    ("2025-01", "يناير 25"),
    ("2025-02", "فبراير 25"),
    ("2025-03", "مارس 25"),
    ("2025-04", "أبريل 25"),
    ("2025-05", "مايو 25"),
    ("2025-06", "يونيو 25"),
    ("2025-07", "يوليو 25"),
    ("2025-08", "أغسطس 25"),
    ("2025-09", "سبتمبر 25"),
    ("2025-10", "أكتوبر 25"),
    ("2025-11", "نوفمبر 25"),
    ("2025-12", "ديسمبر 25"),
    ("2026-01", "يناير 26"),
    ("2026-02", "فبراير 26"),
    ("2026-03", "مارس 26")
]

# Check how date / year / month are stored in questions
counts = Counter()
for q in questions:
    ym = f"{q.get('year')}-{str(q.get('month')).zfill(2)}"
    counts[ym] += 1

print("Exact timeline distribution for ALL 11,596 questions:")
for k, label in month_keys:
    print(f"  {label} ({k}): {counts.get(k, 0)}")

# Check for a specific filter e.g. Christian questions
christian_counts = Counter()
for q in questions:
    if q.get("faith_ar") == "المسيحية":
        ym = f"{q.get('year')}-{str(q.get('month')).zfill(2)}"
        christian_counts[ym] += 1

print("\nExact timeline distribution for Christian questions (2,760):")
for k, label in month_keys:
    print(f"  {label} ({k}): {christian_counts.get(k, 0)}")
