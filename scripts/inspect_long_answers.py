import json

with open(r"d:\Midade.Com\islam_chat_dashboard\assets\data\enriched_qa_dataset.min.json", "r", encoding="utf-8") as f:
    dataset = json.load(f)

long_qa = [q for q in dataset["questions"] if len(q.get("answer", "")) > 400][:3]
for q in long_qa:
    print(f"\n--- Q ID #{q['id']} (Chat #{q['conversation_id']}) ---")
    print("Q:", q["question"])
    print("A:", q["answer"][:600])
