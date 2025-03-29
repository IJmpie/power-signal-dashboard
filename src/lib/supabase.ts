
import { createClient } from '@supabase/supabase-js'

// These values should be replaced with your actual Supabase URL and anon key
// You'll need to add these through the Supabase integration in Lovable
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
