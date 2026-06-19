import requests
import json

url = 'https://kprbltjqxnrvkybjtgmb.supabase.co/rest/v1/templates'
headers = {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwcmJsdGpxeG5ydmt5Ymp0Z21iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDU5NzcyMCwiZXhwIjoyMDk2MTczNzIwfQ.R0nwIW6tjoua6FJ8ESxcM2cTlgoERpmqvT--0bBWPCk',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwcmJsdGpxeG5ydmt5Ymp0Z21iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDU5NzcyMCwiZXhwIjoyMDk2MTczNzIwfQ.R0nwIW6tjoua6FJ8ESxcM2cTlgoERpmqvT--0bBWPCk',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
}

response = requests.get(f"{url}?select=id,slug,name", headers=headers)
templates = response.json()
print("CURRENT TEMPLATES:", json.dumps(templates, indent=2))

for t in templates:
    slug = t['slug']
    new_name = t['name']
    
    # Simplify names based on slug or current name
    if slug == 'val-starry-constellation-01':
        new_name = 'Valentine #1'
    elif slug == 'valentine-2':
        new_name = 'Valentine #2'
    elif slug == 'dating-1':
        new_name = 'Dating #1'
    elif slug == 'dating-2':
        new_name = 'Dating #2'
    elif slug == 'dating-3':
        new_name = 'Dating #3'
    elif slug == 'birthday-1':
        new_name = 'Birthday #1'
        
    payload = {
        'name': new_name,
        'base_price': 2000
    }
    
    update_res = requests.patch(f"{url}?slug=eq.{slug}", headers=headers, json=payload)
    print(f"Updated {slug}: status {update_res.status_code}")

print("DONE")
