import json
from pathlib import Path

DIR_PATH = Path(r"D:\Midade.Com\islam_chat_dashboard\LLM point extraction and analysis")
NB_PATH = DIR_PATH / "Point_Analysis.ipynb"

with open(NB_PATH, "r", encoding="utf-8") as f:
    nb = json.load(f)

print(f"Total cells in Point_Analysis.ipynb: {len(nb.get('cells', []))}")
for i, cell in enumerate(nb.get("cells", [])):
    source = "".join(cell.get("source", []))
    lines = [l.strip() for l in source.split("\n") if l.strip()]
    if lines:
        print(f"Cell {i} ({cell.get('cell_type')}): {lines[0][:90]}")
        for l in lines[1:4]:
            if l.startswith("#"):
                print("   |", l[:80])
