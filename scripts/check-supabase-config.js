#!/usr/bin/env node

import dotenv from "dotenv"

/**
 * Supabase Configuration Diagnostic Script
 * Checks if Supabase is properly configured
 */

dotenv.config({ path: ".env.local" })

console.log("🔍 Checking Supabase Configuration...\n")

// Check environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PWA4_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_PWA4_SERVICE_ROLE_KEY

console.log("📋 Environment Variables:")
console.log(`   NEXT_PUBLIC_SUPABASE_PWA4_URL: ${supabaseUrl ? "✅ Set" : "❌ MISSING"}`)
console.log(`   NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY: ${supabaseAnonKey ? "✅ Set" : "❌ MISSING"}`)
console.log(`   SUPABASE_PWA4_SERVICE_ROLE_KEY: ${serviceRoleKey ? "✅ Set" : "❌ MISSING"}`)

if (!supabaseUrl || !supabaseAnonKey) {
  console.log("\n❌ CRITICAL: Supabase environment variables are missing!")
  console.log("\n📝 To fix:")
  console.log("1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables")
  console.log("2. Add these variables:")
  console.log("   - NEXT_PUBLIC_SUPABASE_PWA4_URL")
  console.log("   - NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY")
  console.log("   - SUPABASE_PWA4_SERVICE_ROLE_KEY")
  console.log("\n3. Get values from: Supabase Dashboard → Project Settings → API")
  process.exit(1)
}

// Check if URL looks like a demo/test URL
if (
  supabaseUrl.includes("demo") ||
  supabaseUrl.includes("test") ||
  supabaseUrl.includes("example")
) {
  console.log('\n⚠️  WARNING: Supabase URL contains "demo", "test", or "example"')
  console.log("   This might be a demo/test project URL!")
  console.log("   Make sure you're using your actual Supabase project URL.")
}

// Check URL format
if (!supabaseUrl.includes("supabase.co")) {
  console.log("\n⚠️  WARNING: Supabase URL doesn't look like a valid Supabase URL")
  console.log("   Expected format: https://xxxxx.supabase.co")
}

// Check if key format is correct
if (supabaseAnonKey && !supabaseAnonKey.startsWith("eyJ")) {
  console.log("\n⚠️  WARNING: Supabase anon key format looks incorrect")
  console.log("   Expected format: eyJ... (JWT token)")
}

// Display URL (partially masked for security)
if (supabaseUrl) {
  const urlParts = supabaseUrl.split(".")
  const maskedUrl =
    urlParts.length > 0
      ? `${urlParts[0].substring(0, 8)}...${urlParts[0].substring(urlParts[0].length - 4)}.supabase.co`
      : supabaseUrl
  console.log(`\n🔗 Supabase URL: ${maskedUrl}`)
}

console.log("\n✅ Basic configuration check complete!")
console.log("\n📝 Next steps:")
console.log("1. Verify the Supabase URL matches your project in Supabase Dashboard")
console.log("2. Make sure OAuth providers (Google/Apple) are enabled in Supabase")
console.log("3. Check redirect URLs are configured in Supabase Dashboard")
console.log("   - https://airbear.me/auth/callback")
console.log("   - http://localhost:3000/auth/callback")

process.exit(0)
