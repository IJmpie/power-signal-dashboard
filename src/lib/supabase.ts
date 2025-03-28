
import { createClient } from '@supabase/supabase-js'

// For development testing - replace with your actual Supabase project details
// Get these from your Supabase project dashboard
const supabaseUrl = 'https://xyzcompany.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; 

// Check if we have the required configuration
if (!supabaseUrl || supabaseUrl === 'https://xyzcompany.supabase.co') {
  console.warn(
    'Supabase URL not configured properly. Please set up your Supabase project and update the URL in src/lib/supabase.ts.'
  );
}

if (!supabaseAnonKey || supabaseAnonKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...') {
  console.warn(
    'Supabase Anon Key not configured properly. Please set up your Supabase project and update the key in src/lib/supabase.ts.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
