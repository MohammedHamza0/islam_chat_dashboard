import json
from collections import Counter
from pathlib import Path

DIR_PATH = Path(r"D:\Midade.Com\islam_chat_dashboard\LLM point extraction and analysis")
JSON_PATH = DIR_PATH / "full_conversation_points_extraction.json"

with open(JSON_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

results = data.get("results", [])
print(f"Total conversations in LLM analysis: {len(results)}")

religions = Counter()
intents = Counter()
funnels = Counter()
conv_types = Counter()
is_muslim = Counter()
start_moods = Counter()
end_moods = Counter()
blockers = Counter()

for r in results:
    demo = r.get("user_demographics", {})
    rel = demo.get("suspected_religion")
    religions[str(rel)] += 1
    is_muslim[str(demo.get("is_existing_muslim"))] += 1

    intent_funnel = r.get("intent_and_funnel", {})
    intents[str(intent_funnel.get("user_intent"))] += 1
    funnels[str(intent_funnel.get("conversion_funnel"))] += 1

    conv_types[str(r.get("conversation_type"))] += 1

    emo = r.get("emotional_trajectory", {})
    start_moods[str(emo.get("start_mood"))] += 1
    end_moods[str(emo.get("end_mood"))] += 1

    theo = r.get("theological_profile", {})
    block = theo.get("key_blocker")
    if block and block != "N/A" and block != "None":
        blockers[str(block)] += 1

print("\n--- Suspected Religion Distribution (LLM Analysis) ---")
for k, v in religions.most_common(12):
    print(f"  - {k}: {v} ({v/len(results)*100:.1f}%)")

print("\n--- User Intent Distribution (LLM Analysis) ---")
for k, v in intents.most_common(12):
    print(f"  - {k}: {v} ({v/len(results)*100:.1f}%)")

print("\n--- Conversion Funnel Stages (LLM Analysis) ---")
for k, v in funnels.most_common(10):
    print(f"  - {k}: {v} ({v/len(results)*100:.1f}%)")

print("\n--- Conversation Types ---")
for k, v in conv_types.most_common(10):
    print(f"  - {k}: {v} ({v/len(results)*100:.1f}%)")

print("\n--- Top Theological Blockers / Objections ---")
for k, v in blockers.most_common(10):
    print(f"  - {k}: {v}")
