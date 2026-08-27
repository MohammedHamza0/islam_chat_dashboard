import json
import urllib.request

with open(r"d:\Midade.Com\islam_chat_dashboard\assets\data\enriched_qa_dataset.min.json", "r", encoding="utf-8") as f:
    dataset = json.load(f)

questions = dataset.get("questions", [])

def filter_sim(year="all", month="all"):
    res = []
    for q in questions:
        if year != "all" and q.get("year") != year:
            continue
        if month != "all":
            qm = str(q.get("month")).zfill(2)
            if qm != month:
                continue
        res.append(q)
    return res

print("=== Testing Month Filter Simulations ===")
c_2024_10 = filter_sim("2024", "10")
print(f"2024 - Oct (10): {len(c_2024_10)} (Expected 12)")
assert len(c_2024_10) == 12, "2024-10 failed"

c_2024_11 = filter_sim("2024", "11")
print(f"2024 - Nov (11): {len(c_2024_11)} (Expected 2)")
assert len(c_2024_11) == 2, "2024-11 failed"

c_2024_12 = filter_sim("2024", "12")
print(f"2024 - Dec (12): {len(c_2024_12)} (Expected 22)")
assert len(c_2024_12) == 22, "2024-12 failed"

c_2025_03 = filter_sim("2025", "03")
print(f"2025 - Mar (03): {len(c_2025_03)} (Expected 1884)")
assert len(c_2025_03) == 1884, "2025-03 failed"

c_2026_01 = filter_sim("2026", "01")
print(f"2026 - Jan (01): {len(c_2026_01)} (Expected 578)")
assert len(c_2026_01) == 578, "2026-01 failed"

print("All month filter simulations passed 100%!")

# Check web server assets
base_url = "http://localhost:8088"
res = urllib.request.urlopen(f"{base_url}/index.html?v=2.4")
html = res.read().decode("utf-8")
assert "quick-months-container" in html, "quick-months-container missing from HTML"
print("HTML verification: quick-months-container present!")

res_js = urllib.request.urlopen(f"{base_url}/assets/js/app.js?v=2.4")
js_code = res_js.read().decode("utf-8")
assert "renderMonthChips" in js_code, "renderMonthChips missing from app.js"
assert "setQuickMonth" in js_code, "setQuickMonth missing from app.js"
print("app.js verification: renderMonthChips and setQuickMonth present!")
