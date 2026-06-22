require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function updateSortOrder() {
  const response = await fetch(`${supabaseUrl}/rest/v1/templates?slug=eq.valentine-3`, {
    method: 'PATCH',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      sort_order: 3
    })
  });

  const data = await response.json();
  console.log("Updated template:", data);
}

updateSortOrder();
