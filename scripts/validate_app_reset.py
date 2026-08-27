from pathlib import Path

WORKSPACE = Path(r"d:\Midade.Com\islam_chat_dashboard")
APP_JS = WORKSPACE / "assets" / "js" / "app.js"

with open(APP_JS, "r", encoding="utf-8") as f:
    code = f.read()

assert "filter-followup" not in code, "filter-followup should not be in app.js"
assert "this.applyFilters()" in code, "this.applyFilters() must be called in resetAllFilters"
print("app.js resetAllFilters validation: PASSED!")
