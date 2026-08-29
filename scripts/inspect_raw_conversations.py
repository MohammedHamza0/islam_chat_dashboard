import json

with open(r"d:\Midade.Com\islam_chat_dashboard\assets\data\conversations_lookup.json", "r", encoding="utf-8") as f:
    lookup = json.load(f)

print(f"Total conversations in lookup: {len(lookup)}")
sample_keys = list(lookup.keys())[:3]
for k in sample_keys:
    conv = lookup[k]
    print(f"\n--- Conversation #{k} ---")
    raw = conv.get("full_conversation", "")
    print(raw[:500] + ("..." if len(raw) > 500 else ""))
