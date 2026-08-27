import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

DIR_PATH = Path(r"D:\Midade.Com\islam_chat_dashboard\LLM point extraction and analysis\Eng.Menna")

def read_sheet_content(xlsx_name, sheet_idx=1):
    wb_path = DIR_PATH / xlsx_name
    rows_data = []
    with zipfile.ZipFile(wb_path) as z:
        sheet_file = f'xl/worksheets/sheet{sheet_idx}.xml'
        if sheet_file not in z.namelist():
            for name in z.namelist():
                if name.startswith('xl/worksheets/sheet'):
                    sheet_file = name
                    break
        
        strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
            for elem in tree.iter():
                if elem.tag.endswith('t') and elem.text:
                    strings.append(elem.text)
        
        s_tree = ET.fromstring(z.read(sheet_file))
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
                                idx = int(v.text)
                                val = strings[idx] if idx < len(strings) else v.text
                            else:
                                val = v.text
                        is_elem = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}is')
                        if is_elem is not None:
                            t_elem = is_elem.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')
                            if t_elem is not None and t_elem.text:
                                val = t_elem.text
                        row_vals.append(val)
                if any(row_vals):
                    rows_data.append(row_vals)
    return rows_data

print("==================================================")
print("1. existing_muslim_dawah_bot_analysis.xlsx (Sheet 1)")
print("==================================================")
for r in read_sheet_content("existing_muslim_dawah_bot_analysis.xlsx", 1)[:16]:
    print("  ", r)

print("\n==================================================")
print("2. religion_specific_concern_playbooks.xlsx (Sheet 1)")
print("==================================================")
for r in read_sheet_content("religion_specific_concern_playbooks.xlsx", 1)[:16]:
    print("  ", r)

print("\n==================================================")
print("3. islamic_dawah_topics_analysis.xlsx (Sheet 1)")
print("==================================================")
for r in read_sheet_content("islamic_dawah_topics_analysis.xlsx", 1)[:16]:
    print("  ", r)
