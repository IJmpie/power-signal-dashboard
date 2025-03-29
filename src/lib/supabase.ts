
import { createClient } from '@supabase/supabase-js'

// These values should be replaced with your actual Supabase URL and anon key
// through the Supabase integration in Lovable
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

// Verify if valid configuration exists
const isSupabaseConfigured = supabaseUrl.includes('https://') && 
                            !supabaseUrl.includes('your-supabase-url') && 
                            supabaseAnonKey.length > 10;

// Create the Supabase client with proper error handling
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder-project.supabase.co', 'placeholder-key');

export const isSupabaseReady = isSupabaseConfigured;
