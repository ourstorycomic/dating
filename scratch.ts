import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import WebSocket from 'ws'
Object.assign(global, { WebSocket })
dotenv.config({ path: '.env' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  const { data, error } = await supabase
    .from('templates')
    .update({ base_price: 2000 })
    .neq('id', '00000000-0000-0000-0000-000000000000') 
    
  if (error) {
    console.error('Error updating templates:', error)
  } else {
    console.log('Successfully updated all templates to 2000')
  }
}

main()
