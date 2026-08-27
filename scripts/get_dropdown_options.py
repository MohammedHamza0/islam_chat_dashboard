import json
from collections import Counter

with open(r"d:\Midade.Com\islam_chat_dashboard\assets\data\enriched_qa_dataset.min.json", "r", encoding="utf-8") as f:
    data = json.load(f)

questions = data.get("questions", [])

def print_breakdown(name, field):
    c = Counter(q.get(field) for q in questions)
    print(f"\n--- {name} ({field}) ---")
    for k, v in c.most_common():
        print(f'  <option value="{k}">{k} ({v:,})</option>')

print_breakdown("Religion (faith_ar)", "faith_ar")
print_breakdown("Intent (intent_ar)", "intent_ar")
print_breakdown("Conversion Funnel (funnel_stage_ar)", "funnel_stage_ar")
print_breakdown("Key Blocker (key_blocker_ar)", "key_blocker_ar")
print_breakdown("Conversation Type (conversation_type_ar)", "conversation_type_ar")
print_breakdown("Topic (topic_ar)", "topic_ar")
print_breakdown("Region (region_ar)", "region_ar")

# KPIs
print("\n--- KPI STATS ---")
print("Total Questions:", len(questions))
print("Genuine Seekers:", len([q for q in questions if q.get("intent") == "Genuine Seeker"]))
print("Challengers:", len([q for q in questions if q.get("intent") == "Challenger"]))
print("Converted:", len([q for q in questions if q.get("funnel_stage") == "Converted"]))
print("Conversion Interest:", len([q for q in questions if q.get("intent") == "Conversion Interest"]))
