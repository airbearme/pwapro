import { createClient } from "@supabase/supabase-js";

// Use environment variables for credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fofmrqgcidfenbevayrg.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseServiceKey || !supabaseAnonKey) {
  console.error("❌ Missing environment variables: SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.");
  process.exit(1);
}

console.log("🔌 Testing Supabase Connection...");
console.log("URL:", supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function test() {
	try {
		// Test auth
		const { data: authData, error: authError } =
			await supabase.auth.admin.listUsers();

		if (authError) {
			console.log("❌ Auth Error:", authError.message);
		} else {
			console.log("✅ Auth Connected! Users:", authData.users.length);
		}

		// Test database access
		const { data: tables, error: dbError } = await supabase
			.from("spots")
			.select("*")
			.limit(1);

		if (dbError) {
			console.log("⚠️  Spots table error:", dbError.message);
			console.log("   (Table may not exist yet - this is OK)");
		} else {
			console.log("✅ Database Connected! Spots found:", tables?.length || 0);
		}

		console.log("\n🎉 Connection test completed!");
	} catch (e) {
		console.log("❌ Exception:", e.message);
	}
}

test();
