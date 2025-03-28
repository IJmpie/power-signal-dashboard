
import { createClient } from '@supabase/supabase-js'

// For development purposes only - in production these should be set as environment variables
// via the Lovable Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 
  'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'your-anon-key';

// Check if we have the required configuration
if (!supabaseUrl || supabaseUrl === 'https://your-project-url.supabase.co') {
  console.warn(
    'Supabase URL not configured properly. Please set up your Supabase project and update the URL.'
  );
}

if (!supabaseAnonKey || supabaseAnonKey === 'your-anon-key') {
  console.warn(
    'Supabase Anon Key not configured properly. Please set up your Supabase project and update the key.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
