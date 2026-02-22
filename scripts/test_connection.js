
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vtnvfwzuhrsnbjqulocn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0bnZmd3p1aHJzbmJqcXVsb2NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3Mjg2MDAsImV4cCI6MjA4NzMwNDYwMH0.k3cGQmTN9NQLTCkXceLCHtkowisT_pvQfZktnQ8MIzw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing connection to:', supabaseUrl);
  try {
    const { data, error } = await supabase.from('products').select('*').limit(1);
    if (error) {
      console.error('Connection failed:', error);
    } else {
      console.log('Connection successful! Data:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testConnection();
