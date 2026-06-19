require('dotenv').config();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/templates?select=*&limit=1';
fetch(url, {
  headers: {
    apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: 'Bearer ' + process.env.SUPABASE_SERVICE_ROLE_KEY
  }
}).then(r => r.json()).then(console.log);
