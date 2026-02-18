import { createClient } from "@supabase/supabase-js";

const credentials = [
  {
    name: "archon-chatty",
    key: process.env.ARCHON_CHATTY_KEY || "[KEY_REQUIRED]",
    url: "https://etzsxcurkrjfmanhrgou.supabase.co",
    key: process.env.ARCHON_CHATTY_KEY || "[KEY_REQUIRED]",
  },
  {
    name: "supabase-purple-zebra",
    key: process.env.PURPLE_ZEBRA_KEY || "[KEY_REQUIRED]",
    url: "https://gtomvmymfcjswvxuclii.supabase.co",
    key: process.env.PURPLE_ZEBRA_KEY || "[KEY_REQUIRED]",
  },
  {
    name: "airbearme-project",
    key: process.env.AIRBEARME_PROJECT_KEY || "[KEY_REQUIRED]",
    url: "https://xckggdmqfqajatytmiko.supabase.co",
    key: process.env.AIRBEARME_PROJECT_KEY || "[KEY_REQUIRED]",
  },
];

async function check(creds) {
  console.log("Testing:", creds.name, creds.url);
  const supabase = createClient(creds.url, creds.key);
  try {
    const { data, error } = await supabase.from("users").select("id").limit(1);
    if (error) {
      console.log("❌ Error:", error.message);
      // Try auth check
      const { data: auth, error: authErr } =
        await supabase.auth.admin.listUsers();
      if (authErr) {
        console.log("❌ Auth Error:", authErr.message);
      } else {
        console.log("✅ Auth Connected! Users:", auth.users.length);
      }
    } else {
      console.log("✅ Connected! Data access OK");
    }
  } catch (e) {
    console.log("timeout/fetch failed", e.message);
  }
}

async function run() {
  for (const c of credentials) {
    await check(c);
    console.log("---");
  }
}

run();
