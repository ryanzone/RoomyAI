require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function runTest() {
  console.log("🚀 Testing connection...");
  console.log("URL:", supabaseUrl ? "✅ Found" : "❌ NOT FOUND");
  console.log("KEY:", supabaseKey ? "✅ Found" : "❌ NOT FOUND");

  if (!supabaseUrl || !supabaseKey) {
    console.error("Stopping: Missing environment variables in .env.local");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);

  if (error) {
    console.log("❌ Connection failed!");
    console.error("Error Message:", error.message);
  } else {
    console.log("✅ Connection successful!");
    console.log("Data from 'profiles':", data);
  }
}

runTest();