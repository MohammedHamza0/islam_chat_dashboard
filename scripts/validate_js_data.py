import json

js_path = r"d:\Midade.Com\islam_chat_dashboard\assets\data\enriched_qa_data.js"
with open(js_path, "r", encoding="utf-8") as f:
    line = f.read()

prefix = "window.ENRICHED_QA_DATASET = "
suffix = ";"

if line.startswith(prefix) and line.endswith(suffix):
    json_part = line[len(prefix):-len(suffix)]
    data = json.loads(json_part)
    print(f"enriched_qa_data.js valid! Questions count: {len(data['questions'])}")
else:
    print("Invalid format in enriched_qa_data.js")

js_conv_path = r"d:\Midade.Com\islam_chat_dashboard\assets\data\conversations_data.js"
with open(js_conv_path, "r", encoding="utf-8") as f:
    line_conv = f.read()

prefix_c = "window.CONVERSATIONS_LOOKUP = "
if line_conv.startswith(prefix_c) and line_conv.endswith(";"):
    json_part_c = line_conv[len(prefix_c):-1]
    conv_data = json.loads(json_part_c)
    print(f"conversations_data.js valid! Conversations count: {len(conv_data)}")
else:
    print("Invalid format in conversations_data.js")
