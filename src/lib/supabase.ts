import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ncqeyliurneoyhqgeghc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jcWV5bGl1cm5lb3locWdlZ2hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTY2MDMsImV4cCI6MjA5MDUzMjYwM30.noDOZ6JLopXT7QX1pfflIBN82rxSe_pSnR2I7x61-4E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});
