import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

DIR_PATH = Path(r"D:\Midade.Com\islam_chat_dashboard\LLM point extraction and analysis")
DOCX_PATH = DIR_PATH / "dawah_bot_report.docx"

with zipfile.ZipFile(DOCX_PATH) as z:
    xml_content = z.read('word/document.xml')
    tree = ET.fromstring(xml_content)
    texts = [elem.text for elem in tree.iter() if elem.text]
    full_text = ' '.join(texts)
    print("Sample text from dawah_bot_report.docx (first 800 chars):")
    print(full_text[:800])
