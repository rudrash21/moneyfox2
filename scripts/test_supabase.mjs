import { createClient } from '@supabase/supabase-js';

const url = 'https://qxwqemlsxjvdpnxjkezr.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4d3FlbWxzeGp2ZHBueGprZXpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwNDMwODQsImV4cCI6MjEwNzYxOTA4NH0.pqqlteBh6c04EcMCTuxsS-IRZtWbb7wFvK5WIEKMSos';

const supabase = createClient(url, key);

async function test() {
  console.log('Testing Supabase connection...');
  const tables = ['users', 'payments', 'delivery', 'global_waiting_bench', 'products', 'orders'];
  for (const table of tables) {
    try {
      const { data, error, count } = await supabase.from(table).select('*', { count: 'exact' }).limit(3);
      if (error) {
        console.log(`Table '${table}': Error - ${error.message} (code: ${error.code})`);
      } else {
        console.log(`Table '${table}': OK (${data.length} rows, total count: ${count})`);
        if (data.length > 0) {
          console.log(`   Sample:`, JSON.stringify(data[0]));
        }
      }
    } catch (e) {
      console.log(`Table '${table}': Exception - ${e.message}`);
    }
  }
}

test();
