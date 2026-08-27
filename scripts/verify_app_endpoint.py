import urllib.request

url = "http://localhost:8088/assets/js/app.js?v=2.1"
try:
    resp = urllib.request.urlopen(url)
    content = resp.read().decode("utf-8")
    print(f"app.js fetched successfully! Status: {resp.status}, Length: {len(content)}")
    assert "showToast" in content, "showToast missing"
    assert "filter-followup" not in content, "filter-followup must not exist"
    print("Verification: 100% OK!")
except Exception as e:
    print(f"Error fetching app.js: {e}")
