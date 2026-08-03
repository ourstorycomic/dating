import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function run() {
  const { data, error } = await supabase
    .from("custom_roles")
    .select("id, name, cross_role_commissions:CrossRoleCommission!CrossRoleCommission_parentRoleId_fkey(child_role_id:childRoleId, percentage, is_active)")
    .limit(1);
  console.log(JSON.stringify(data, null, 2));
  console.log("Error:", error);
}
run();
