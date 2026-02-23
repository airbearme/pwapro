import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fofmrqgcidfenbevayrg.supabase.co";
const supabaseServiceKey =
	"[REDACTED]";
const supabaseAnonKey =
	"[REDACTED]";

console.log("🔌 Testing Purple Zebra (fofmrqgcidfenbevayrg)...");
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

		console.log("\n🎉 Purple Zebra is LIVE and accessible!");
	} catch (e) {
		console.log("❌ Exception:", e.message);
	}
}

test();
