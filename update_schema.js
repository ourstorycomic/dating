require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function updateSchema() {
  // First get the current schema
  const getRes = await fetch(`${supabaseUrl}/rest/v1/templates?slug=eq.dating-2`, {
    method: 'GET',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    }
  });
  
  const templates = await getRes.json();
  if (!templates || templates.length === 0) {
    console.log("Dating 2 not found");
    return;
  }
  
  const tpl = templates[0];
  let schema = tpl.data_schema;
  
  // Update the schema to allow objects for vibeOptions
  if (schema && schema.properties) {
    schema.properties.vibeOptions = {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: { type: "string" },
          response: { type: "string" }
        }
      }
    };
  } else {
    schema = {
      type: "object",
      properties: {
        vibeOptions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              label: { type: "string" },
              response: { type: "string" }
            }
          }
        }
      }
    };
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/templates?slug=eq.dating-2`, {
    method: 'PATCH',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      data_schema: schema
    })
  });

  const data = await response.json();
  console.log("Updated schema for dating-2");
}

updateSchema();
