const URL = "https://kprbltjqxnrvkybjtgmb.supabase.co/rest/v1/templates?id=not.is.null";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwcmJsdGpxeG5ydmt5Ymp0Z21iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDU5NzcyMCwiZXhwIjoyMDk2MTczNzIwfQ.R0nwIW6tjoua6FJ8ESxcM2cTlgoERpmqvT--0bBWPCk";

fetch(URL, {
  method: 'PATCH',
  headers: {
    'apikey': KEY,
    'Authorization': `Bearer ${KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal'
  },
  body: JSON.stringify({ base_price: 2000 })
}).then(async r => {
  console.log(r.status, await r.text());
});
