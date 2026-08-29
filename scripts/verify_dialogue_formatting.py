import urllib.request
import re
from pathlib import Path

WORKSPACE = Path(r"d:\Midade.Com\islam_chat_dashboard")

# 1. Verify index.html contains reader toolbar
with open(WORKSPACE / "index.html", "r", encoding="utf-8") as f:
    html = f.read()

assert "modal-reader-tools" in html, "modal-reader-tools missing from index.html"
assert "modal-stats-container" in html, "modal-stats-container missing from index.html"
assert "font-zoom-group" in html, "font-zoom-group missing from index.html"
print("HTML verification: modal reader toolbar present!")

# 2. Verify modal.css contains formatting classes
with open(WORKSPACE / "assets" / "css" / "modal.css", "r", encoding="utf-8") as f:
    css = f.read()

assert ".chat-list" in css, ".chat-list missing from modal.css"
assert ".chat-list-num" in css, ".chat-list-num missing from modal.css"
assert ".btn-copy-bubble" in css, ".btn-copy-bubble missing from modal.css"
assert "--chat-font-size" in css, "--chat-font-size missing from modal.css"
print("CSS verification: rich formatting and copy styles present!")

# 3. Verify JS component methods
with open(WORKSPACE / "assets" / "js" / "components" / "dialogue-modal.component.js", "r", encoding="utf-8") as f:
    js = f.read()

assert "formatBotMessage" in js, "formatBotMessage missing from JS"
assert "copyBubbleText" in js, "copyBubbleText missing from JS"
assert "changeFontSize" in js, "changeFontSize missing from JS"
print("JS verification: formatBotMessage and font zoom methods present!")

# 4. Verify server endpoints
base_url = "http://localhost:8088"
req = urllib.request.urlopen(f"{base_url}/index.html?v=3.1")
assert req.status == 200, "Server failed to load index.html?v=3.1"
req_modal = urllib.request.urlopen(f"{base_url}/assets/js/components/dialogue-modal.component.js?v=3.1")
assert req_modal.status == 200, "Server failed to load dialogue-modal.component.js?v=3.1"
print("Server status 200 for all updated assets!")

print("=== ALL DIALOGUE FORMATTING VERIFICATIONS PASSED 100% ===")
