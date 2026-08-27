import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

DIR_PATH = Path(r"D:\Midade.Com\islam_chat_dashboard\LLM point extraction and analysis\Eng.Menna")

def get_xlsx_sheet_rows(xlsx_name, target_sheet="Dashboard"):
    wb_path = DIR_PATH / xlsx_name
    rows_data = []
    with zipfile.ZipFile(wb_path) as z:
        strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
            for elem in tree.iter():
                if elem.tag.endswith('t') and elem.text:
                    strings.append(elem.text)
        
        # Load sheets from workbook.xml
        wb_tree = ET.fromstring(z.read('xl/workbook.xml'))
        sheet_map = {}
        for s in wb_tree.iter():
            if s.tag.endswith('sheet'):
                sheet_map[s.attrib.get('name')] = s.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id') or s.attrib.get('r:id')
        
        # Determine sheet filename
        rels_tree = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
        r_target = {}
        for r in rels_tree.iter():
            if r.tag.endswith('Relationship'):
                r_target[r.attrib.get('Id')] = r.attrib.get('Target')
        
        rid = sheet_map.get(target_sheet, 'rId1')
        target_path = r_target.get(rid, 'worksheets/sheet1.xml')
        if not target_path.startswith('xl/'):
            target_path = 'xl/' + target_path.lstrip('/')
        
        s_tree = ET.fromstring(z.read(target_path))
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
print("1. AUDITING existing_muslim_dawah_bot_analysis.xlsx")
print("==================================================")
rows_muslim = get_xlsx_sheet_rows("existing_muslim_dawah_bot_analysis.xlsx", "Dashboard")
for r in rows_muslim[:16]:
    print("  ", r)

print("\n==================================================")
print("2. AUDITING religion_specific_concern_playbooks.xlsx")
print("==================================================")
rows_rel = get_xlsx_sheet_rows("religion_specific_concern_playbooks.xlsx", "Dashboard")
for r in rows_rel[:16]:
    print("  ", r)

print("\n==================================================")
print("3. AUDITING islamic_dawah_topics_analysis.xlsx")
print("==================================================")
rows_topics = get_xlsx_sheet_rows("islamic_dawah_topics_analysis.xlsx", "Dashboard")
for r in rows_topics[:16]:
    print("  ", r)
