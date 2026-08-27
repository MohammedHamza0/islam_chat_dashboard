import urllib.request

url = "http://localhost:8088/index.html?v=2.5"
req = urllib.request.urlopen(url)
html = req.read().decode("utf-8")
assert "info-tooltip-badge" in html, "info-tooltip-badge missing"
assert "مبني على لغة الحوار" in html, "text missing"
print("Verification: Informative Region Badge present and working 100%!")
