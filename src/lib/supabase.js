
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

const isCredentialsMissing = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder');

// Only use mock mode when credentials are genuinely missing.
// force_mock_mode is only respected when credentials are missing (not to override real credentials).
if (!isCredentialsMissing && typeof window !== 'undefined') {
  // Clean up stale force_mock_mode flag if real credentials exist
  localStorage.removeItem('force_mock_mode');
}

export const isMockMode = isCredentialsMissing;

if (isMockMode) {
  console.log(`⚠️ Running in Mock Mode: Supabase credentials not found.`);
} else {
  console.log(`✅ Running in Deploy Mode: Connected to Supabase.`);
}

