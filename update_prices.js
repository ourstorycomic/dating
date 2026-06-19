const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://kprbltjqxnrvkybjtgmb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwcmJsdGpxeG5ydmt5Ymp0Z21iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDU5NzcyMCwiZXhwIjoyMDk2MTczNzIwfQ.R0nwIW6tjoua6FJ8ESxcM2cTlgoERpmqvT--0bBWPCk'
);

async function updatePrices() {
  const { data, error } = await supabase
    .from('templates')
    .update({ base_price: 2000 })
    .neq('slug', 'random-non-existent-string'); // To update all rows, we use a dummy condition

  if (error) {
    console.error('Error updating prices:', error);
  } else {
    console.log('Successfully updated prices to 2000 VND.');
  }
}

updatePrices();
