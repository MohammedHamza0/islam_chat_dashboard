import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

DIR_PATH = Path(r"D:\Midade.Com\islam_chat_dashboard\LLM point extraction and analysis\Eng.Menna")

print("=== 1. Reading Analyze top conversation topics.md summary ===")
with open(DIR_PATH / "Analyze top conversation topics.md", "r", encoding="utf-8", errors="ignore") as f:
    md_lines = f.readlines()

print(f"Total lines: {len(md_lines)}")
for l in md_lines[:45]:
    print(l.rstrip())

def dump_sheet_data(xlsx_name, target_sheet_name=None, max_rows=15):
    print(f"\n--- Reading Sheet Data from {xlsx_name} ---")
    wb_path = DIR_PATH / xlsx_name
    with zipfile.ZipFile(wb_path) as z:
        # Load shared strings if any
        strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
            for elem in tree.iter():
                if elem.tag.endswith('t') and elem.text:
                    strings.append(elem.text)
        
        # Load sheet map
        wb_tree = ET.fromstring(z.read('xl/workbook.xml'))
        sheet_info = []
        for s in wb_tree.iter():
            if s.tag.endswith('sheet'):
                sheet_info.append((s.attrib.get('name'), s.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id') or s.attrib.get('r:id') or 'rId1'))
        
        # Read sheet1.xml or matching sheet
        for sheet_name, rid in sheet_info:
            if target_sheet_name and sheet_name != target_sheet_name:
                continue
            sheet_file = None
            for fname in z.namelist():
                if fname.startswith('xl/worksheets/sheet'):
                    sheet_file = fname
                    break
            if not sheet_file:
                continue
            
            print(f"  [Sheet: {sheet_name}]")
            s_tree = ET.fromstring(z.read(sheet_file))
            row_count = 0
            for row in s_tree.iter():
                if row.tag.endswith('row'):
                    row_vals = []
                    for c in row.iter():
                        if c.tag.endswith('c'):
                            v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                            t = c.attrib.get('t')
                            val = ""
                            if v is not None and v.text:
                                if t == 's' and strings:
                                    val = strings[int(v.text)] if int(v.text) < len(strings) else v.text
                                else:
                                    val = v.text
                            is_elem = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}is')
                            if is_elem is not None:
                                t_elem = is_elem.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')
                                if t_elem is not None and t_elem.text:
                                    val = t_elem.text
                            row_vals.append(val)
                    if any(row_vals):
                        row_count += 1
                        print(f"    Row {row_count}: {row_vals[:10]}")
                        if row_count >= max_rows:
                            break
            break

dump_sheet_data("existing_muslim_dawah_bot_analysis.xlsx")
dump_sheet_data("islamic_dawah_topics_analysis.xlsx")
dump_sheet_data("religion_specific_concern_playbooks.xlsx")
