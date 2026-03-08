#!/usr/bin/env node

/**
 * Environment Variable Validation
 * Ensures all required environment variables are set
 */

import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: ".env.local" });

const requiredEnvVars = [
  "NEXT_PUBLIC_SUPABASE_PWA4_URL",
  "NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY",
  "SUPABASE_PWA4_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
];

const optionalEnvVars = ["NEXT_PUBLIC_SITE_URL", "NODE_ENV"];

function validateEnv() {
  console.log("🔍 Validating environment variables...\n");

  let allValid = true;
  const missing = [];
  const present = [];

  requiredEnvVars.forEach((varName) => {
    if (process.env[varName]) {
      present.push(varName);
      console.log(`✅ ${varName}: Set`);
    } else {
      missing.push(varName);
      console.log(`❌ ${varName}: Missing`);
      allValid = false;
    }
  });

  console.log("\n📋 Optional variables:");
  optionalEnvVars.forEach((varName) => {
    if (process.env[varName]) {
      console.log(`✅ ${varName}: Set`);
    } else {
      console.log(`⚠️  ${varName}: Not set (optional)`);
    }
  });

  if (!allValid) {
    console.log("\n❌ Validation failed. Missing required variables:");
    missing.forEach((v) => console.log(`  - ${v}`));
    process.exit(1);
  } else {
    console.log("\n✅ All required environment variables are set");
    process.exit(0);
  }
}

validateEnv();
