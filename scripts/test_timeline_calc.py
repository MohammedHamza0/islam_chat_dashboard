import json
from collections import Counter

with open(r"d:\Midade.Com\islam_chat_dashboard\assets\data\enriched_qa_dataset.min.json", "r", encoding="utf-8") as f:
    data = json.load(f)

questions = data.get("questions", [])

# Simulate updateCharts JS logic
def simulate_timeline_calc(filtered):
    month_keys = [
        "2024-10", "2024-11", "2024-12", "2025-01", "2025-02", "2025-03",
        "2025-04", "2025-05", "2025-06", "2025-07", "2025-08", "2025-09",
        "2025-10", "2025-11", "2025-12", "2026-01", "2026-02", "2026-03"
    ]
    month_counts = {k: 0 for k in month_keys}
    for q in filtered:
        if q.get("year") and q.get("month"):
            ym = f"{q['year']}-{str(q['month']).zfill(2)}"
            if ym in month_counts:
                month_counts[ym] += 1
    return [month_counts[k] for k in month_keys]

# Test All
all_data = simulate_timeline_calc(questions)
print("Timeline data (All 11,596):", all_data)
assert sum(all_data) == 11596, f"Sum mismatch: {sum(all_data)}"

# Test Converted (346)
converted_qs = [q for q in questions if q.get("funnel_stage_ar") == "اعتنق الإسلام بالفعل (Converted)"]
converted_data = simulate_timeline_calc(converted_qs)
print("Timeline data (Converted 346):", converted_data)
assert sum(converted_data) == 346, f"Converted sum mismatch: {sum(converted_data)}"

print("\nTIMELINE CALCULATION TEST: PASSED 100%!")
