import json
from pathlib import Path

WORKSPACE = Path(r"d:\Midade.Com\islam_chat_dashboard")
CONV_JSON = WORKSPACE / "assets" / "data" / "conversations_lookup.json"
ENRICHED_JSON = WORKSPACE / "assets" / "data" / "enriched_qa_dataset.min.json"

with open(CONV_JSON, "r", encoding="utf-8") as f:
    convs = json.load(f)

with open(ENRICHED_JSON, "r", encoding="utf-8") as f:
    data = json.load(f)

conv_q = [q for q in data.get("questions", []) if q["intent_ar"] == "رغبة في اعتناق الإسلام والشهادة"]

print(f"Total identified conversion questions: {len(conv_q)}\n")

# Inspect 3 sample dialogues in depth
sample_ids = [7981, 12874, 9445]

for sid in sample_ids:
    conv = convs.get(str(sid))
    q_item = next((q for q in conv_q if q["conversation_id"] == sid), None)
    
    print(f"============================================================")
    print(f"📌 CHAT #{sid} - Language: {conv.get('language')} - Date: {conv.get('start_time')}")
    if q_item:
        print(f"Extracted Question: {q_item['question']}")
        print(f"Extracted Answer snippet: {q_item['answer'][:180]}...")
    print(f"\n--- Raw Full Conversation Dialogue ---")
    lines = (conv.get("full_conversation") or "").strip().split("\n")
    for line in lines[:8]:
        print(f"  {line}")
    print("============================================================\n")
