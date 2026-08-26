import json
from pathlib import Path

WORKSPACE = Path(r"d:\Midade.Com\islam_chat_dashboard")
CONV_JSON = WORKSPACE / "assets" / "data" / "conversations_lookup.json"

with open(CONV_JSON, "r", encoding="utf-8") as f:
    convs = json.load(f)

for cid in [7981, 12874, 9445]:
    c = convs.get(str(cid))
    print(f"=== CHAT #{cid} ({c['language']}) ===")
    lines = c['full_conversation'].strip().split('\n')
    for l in lines[:4]:
        print(l[:120])
    print()
