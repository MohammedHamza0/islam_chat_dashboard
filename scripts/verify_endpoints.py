import urllib.request
import json

base_url = "http://localhost:8088"

print("1. Testing index.html fetch...")
try:
    req = urllib.request.urlopen(f"{base_url}/index.html")
    html = req.read().decode('utf-8')
    print(f"index.html OK - Status {req.status}, Length: {len(html)} bytes")
except Exception as e:
    print(f"Error index.html: {e}")

print("2. Testing enriched_qa_dataset.min.json fetch...")
try:
    req = urllib.request.urlopen(f"{base_url}/assets/data/enriched_qa_dataset.min.json")
    data = json.loads(req.read().decode('utf-8'))
    print(f"enriched_qa_dataset.min.json OK - Status {req.status}, Questions: {len(data.get('questions', []))}")
except Exception as e:
    print(f"Error enriched_qa_dataset.min.json: {e}")

print("3. Testing conversations_lookup.json fetch...")
try:
    req = urllib.request.urlopen(f"{base_url}/assets/data/conversations_lookup.json")
    convs = json.loads(req.read().decode('utf-8'))
    print(f"conversations_lookup.json OK - Status {req.status}, Conversations: {len(convs)}")
except Exception as e:
    print(f"Error conversations_lookup.json: {e}")
