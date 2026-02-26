
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
const isForcedMock = typeof window !== 'undefined' && localStorage.getItem('force_mock_mode') === 'true';

export const isMockMode = isCredentialsMissing || isForcedMock;

if (isMockMode) {
  console.log(`⚠️ Running in Mock Mode: ${isForcedMock ? 'Forced by user' : 'Supabase credentials not found'}.`);
}
