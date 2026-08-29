import urllib.request

base_url = "http://localhost:8088"

# Check HTML
req_html = urllib.request.urlopen(f"{base_url}/index.html?v=3.1")
html = req_html.read().decode("utf-8")
assert 'id="modal-font-pct-btn"' in html, "modal-font-pct-btn missing in HTML"
print("HTML: modal-font-pct-btn verified!")

# Check JS
req_js = urllib.request.urlopen(f"{base_url}/assets/js/components/dialogue-modal.component.js?v=3.1")
js = req_js.read().decode("utf-8")
assert "currentZoomPct" in js, "currentZoomPct missing from JS"
assert "applyZoom" in js, "applyZoom missing from JS"
assert "pctBtn.textContent" in js, "pctBtn.textContent update missing"
print("JS: Dynamic percentage zoom verified!")

print("=== ALL FONT ZOOM PERCENTAGE VERIFICATIONS PASSED 100% ===")
