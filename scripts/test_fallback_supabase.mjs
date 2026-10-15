import { createClient } from '@supabase/supabase-js';

const url = 'https://ncqeyliurneoyhqgeghc.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jcWV5bGl1cm5lb3locWdlZ2hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTY2MDMsImV4cCI6MjA5MDUzMjYwM30.noDOZ6JLopXT7QX1pfflIBN82rxSe_pSnR2I7x61-4E';

const supabase = createClient(url, key);

async function test() {
  console.log('Testing fallback Supabase connection...');
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
