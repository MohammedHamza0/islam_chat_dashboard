import urllib.request

base_url = "http://localhost:8088"

endpoints = [
    "index.html",
    "assets/css/base.css",
    "assets/css/navbar.css",
    "assets/css/kpi.css",
    "assets/css/filter-matrix.css",
    "assets/css/qa-explorer.css",
    "assets/css/macro-analytics.css",
    "assets/css/modal.css",
    "assets/js/services/api.service.js",
    "assets/js/services/filter.service.js",
    "assets/js/services/chart.service.js",
    "assets/js/components/qa-card.component.js",
    "assets/js/components/dialogue-modal.component.js",
    "assets/js/components/lightbox.component.js",
    "assets/js/app.js",
    "assets/data/enriched_qa_dataset.min.json",
    "assets/data/conversations_lookup.json"
]

all_ok = True
for ep in endpoints:
    try:
        req = urllib.request.urlopen(f"{base_url}/{ep}")
        print(f"[{req.status}] {ep} - {len(req.read())} bytes")
    except Exception as e:
        print(f"[FAIL] {ep} - {e}")
        all_ok = False

if all_ok:
    print("\nALL MODULAR ASSETS & ENDPOINTS VERIFIED 100% OK!")
else:
    print("\nSOME ENDPOINTS FAILED!")
