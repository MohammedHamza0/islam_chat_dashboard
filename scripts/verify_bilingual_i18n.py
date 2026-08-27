import urllib.request
import re
from pathlib import Path

WORKSPACE = Path(r"d:\Midade.Com\islam_chat_dashboard")

# 1. Read index.html and extract all data-i18n attributes
with open(WORKSPACE / "index.html", "r", encoding="utf-8") as f:
    html = f.read()

i18n_keys_in_html = set(re.findall(r'data-i18n="([^"]+)"', html))
print(f"Found {len(i18n_keys_in_html)} data-i18n keys in index.html: {i18n_keys_in_html}")

# 2. Read i18n.service.js
with open(WORKSPACE / "assets" / "js" / "services" / "i18n.service.js", "r", encoding="utf-8") as f:
    i18n_code = f.read()

# Check that keys are present
missing_keys = []
for k in i18n_keys_in_html:
    if f"{k}:" not in i18n_code:
        missing_keys.append(k)

if missing_keys:
    print(f"WARNING: Missing keys in i18n.service.js: {missing_keys}")
else:
    print("ALL HTML data-i18n keys are 100% matched in i18n.service.js dictionary!")

assert len(missing_keys) == 0, f"Missing i18n keys: {missing_keys}"

# 3. Verify server endpoints
base_url = "http://localhost:8088"
req = urllib.request.urlopen(f"{base_url}/index.html?v=3.0")
assert req.status == 200, "Failed to load index.html from server"
print("Server status 200 for index.html?v=3.0")

req_i18n = urllib.request.urlopen(f"{base_url}/assets/js/services/i18n.service.js?v=3.0")
assert req_i18n.status == 200, "Failed to load i18n.service.js from server"
print("Server status 200 for i18n.service.js?v=3.0")

print("=== ALL BILINGUAL I18N VERIFICATIONS PASSED 100% ===")
