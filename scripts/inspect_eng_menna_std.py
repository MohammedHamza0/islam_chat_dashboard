import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

DIR_PATH = Path(r"D:\Midade.Com\islam_chat_dashboard\LLM point extraction and analysis\Eng.Menna")

print("=== 1. Inspecting Markdown File: Analyze top conversation topics.md ===")
md_path = DIR_PATH / "Analyze top conversation topics.md"
with open(md_path, "r", encoding="utf-8", errors="ignore") as f:
    md_content = f.read()
print(f"MD file size: {len(md_content)} chars")
print("\n--- Top 20 Section Headers in MD ---")
for line in md_content.splitlines():
    if line.startswith("#"):
        print("  ", line[:100])

def inspect_xlsx_zip(excel_name):
    print(f"\n=== Inspecting Excel File: {excel_name} ===")
    wb_path = DIR_PATH / excel_name
    with zipfile.ZipFile(wb_path) as z:
        # Get shared strings
        shared_strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
            for elem in tree.iter():
                if elem.tag.endswith('t') and elem.text:
                    shared_strings.append(elem.text)
        print(f"Total Shared Strings: {len(shared_strings)}")
        print("Sample strings:", shared_strings[:15])
        
        # Get sheets from workbook.xml
        wb_tree = ET.fromstring(z.read('xl/workbook.xml'))
        sheets = []
        for s in wb_tree.iter():
            if s.tag.endswith('sheet'):
                sheets.append(s.attrib.get('name'))
        print("Sheet names:", sheets)

inspect_xlsx_zip("existing_muslim_dawah_bot_analysis.xlsx")
inspect_xlsx_zip("islamic_dawah_topics_analysis.xlsx")
inspect_xlsx_zip("religion_specific_concern_playbooks.xlsx")

print("\n=== 5. Inspecting Notebook: dawah_bot_analysis_workbook_builder.ipynb ===")
nb_path = DIR_PATH / "dawah_bot_analysis_workbook_builder.ipynb"
with open(nb_path, "r", encoding="utf-8") as f:
    import json
    nb = json.load(f)
print(f"Notebook cells: {len(nb.get('cells', []))}")
for i, cell in enumerate(nb.get("cells", [])[:10]):
    src = "".join(cell.get("source", []))
    lines = [l.strip() for l in src.split("\n") if l.strip()]
    if lines:
        print(f"  Cell {i} ({cell.get('cell_type')}): {lines[0][:90]}")

print("\n=== 6. Inspecting HTML: islamic_dawah_bot_interactive_dashboard_ar.html ===")
html_path = DIR_PATH / "islamic_dawah_bot_interactive_dashboard_ar.html"
with open(html_path, "r", encoding="utf-8", errors="ignore") as f:
    html_c = f.read()
print(f"HTML size: {len(html_c)} chars")
for line in html_c.splitlines()[:30]:
    if "<title>" in line or "<h1>" in line or "<h2>" in line or "<h3" in line or "class=" in line:
        print("  ", line.strip()[:100])
