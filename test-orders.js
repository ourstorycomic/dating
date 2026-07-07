require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function test() {
  const { data, error } = await supabase.from('orders').select('id, template_id, templates(id, name, component_key)').limit(1);
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}
test();
