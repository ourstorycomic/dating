const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkTemplates() {
  const { data, error } = await supabase
    .from("templates")
    .select("id, slug, name, is_published, component_key");

  if (error) {
    console.error("Error fetching:", error);
    return;
  }

  console.log("ALL TEMPLATES IN DB:", JSON.stringify(data, null, 2));
}

checkTemplates();
