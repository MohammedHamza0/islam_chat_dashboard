import csv
import sys
from pathlib import Path

csv.field_size_limit(sys.maxsize)

csv_path = Path(r"d:\Midade.Com\islam_chat_dashboard\dataset\organized_conversations_with_language.csv")
with open(csv_path, "r", encoding="utf-8", errors="ignore") as f:
    reader = csv.reader(f)
    headers = next(reader)
    print("Headers in organized_conversations_with_language.csv:", headers)
    row = next(reader)
    print("First row ID:", row[0])
