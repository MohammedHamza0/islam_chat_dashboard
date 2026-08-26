import json
import re

with open(r"d:\Midade.Com\islam_chat_dashboard\assets\data\enriched_qa_dataset.min.json", "r", encoding="utf-8") as f:
    data = json.load(f)

questions = data.get("questions", [])

# Group questions by their extraction source / regex tags
explicit_faith = [q for q in questions if q.get("faith_type") == "Explicit"]
inferred_faith = [q for q in questions if q.get("faith_type") != "Explicit"]

intent_counts = {}
for q in questions:
    intent_counts[q.get("intent_ar")] = intent_counts.get(q.get("intent_ar"), 0) + 1

faith_counts = {}
for q in questions:
    faith_counts[q.get("faith_ar")] = faith_counts.get(q.get("faith_ar"), 0) + 1

print(f"Total Questions: {len(questions)}")
print(f"Explicit Faith Matches (via Regex): {len(explicit_faith)}")
print(f"Inferred Faith Matches (via topic_category + context): {len(inferred_faith)}")

print("\n--- Explicit Faith Breakdown (Regex) ---")
explicit_types = {}
for q in explicit_faith:
    explicit_types[q.get("faith_ar")] = explicit_types.get(q.get("faith_ar"), 0) + 1
for k, v in explicit_types.items():
    print(f"  - {k}: {v}")

print("\n--- Intent Breakdown (Regex & Terms) ---")
for k, v in intent_counts.items():
    print(f"  - {k}: {v}")
