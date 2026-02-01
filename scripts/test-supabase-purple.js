import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gtomvmymfcjswvxuclii.supabase.co";
const supabaseKey =
	"... (your token)";

console.log("🔌 Testing Purple Zebra connection...");
console.log("URL:", supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
	try {
		console.log("Attempting auth check...");
		const { data, error } = await supabase.auth.admin.listUsers();

		if (error) {
			console.log("❌ Auth Error:", error.message);
			console.log("Error details:", JSON.stringify(error, null, 2));
		} else {
			console.log("✅ SUCCESS! Connected to Purple Zebra");
			console.log("Users found:", data.users.length);
		}
	} catch (e) {
		console.log("❌ Exception:", e.message);
	}
}

// Retry with delay
setTimeout(() => {
	console.log("\nRetrying after 5 seconds...");
	test();
}, 5000);

test();
