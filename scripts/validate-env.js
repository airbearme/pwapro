#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * 
 * This script validates that all required environment variables are set
 * and have the correct format.
 * 
 * Usage: node scripts/validate-env.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env.local file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env.local');

try {
  const envFile = readFileSync(envPath, 'utf-8');
  envFile.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        // Remove quotes if present
        const cleanValue = value.replace(/^["']|["']$/g, '');
        if (!process.env[key.trim()]) {
          process.env[key.trim()] = cleanValue;
        }
      }
    }
  });
} catch (error) {
  console.warn(`⚠️  Could not load .env.local: ${error.message}`);
  console.warn('   Make sure .env.local exists in the project root\n');
}

const requiredVars = {
  // Supabase
  NEXT_PUBLIC_SUPABASE_PWA4_URL: {
    required: true,
    validate: (val) => val.startsWith('https://') && val.includes('.supabase.co'),
    error: 'Must be a valid Supabase URL (https://*.supabase.co)'
  },
  NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY: {
    required: true,
    validate: (val) => val.startsWith('eyJ'),
    error: 'Must be a valid JWT token (starts with eyJ)'
  },
  SUPABASE_PWA4_SERVICE_ROLE_KEY: {
    required: true,
    validate: (val) => val.startsWith('eyJ'),
    error: 'Must be a valid JWT token (starts with eyJ)'
  },
  
  // Stripe
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: {
    required: true,
    validate: (val) => val.startsWith('pk_'),
    error: 'Must be a valid Stripe publishable key (starts with pk_)'
  },
  STRIPE_SECRET_KEY: {
    required: true,
    validate: (val) => val.startsWith('sk_'),
    error: 'Must be a valid Stripe secret key (starts with sk_)'
  },
  STRIPE_WEBHOOK_SECRET: {
    required: false,
    validate: (val) => val.startsWith('whsec_'),
    error: 'Must be a valid Stripe webhook secret (starts with whsec_)'
  },
  
  // Site
  NEXT_PUBLIC_SITE_URL: {
    required: true,
    validate: (val) => val.startsWith('http://') || val.startsWith('https://'),
    error: 'Must be a valid URL (starts with http:// or https://)'
  },
  NODE_ENV: {
    required: true,
    validate: (val) => ['development', 'production', 'test'].includes(val),
    error: 'Must be one of: development, production, test'
  }
};

const optionalVars = {
  VITE_SUPABASE_URL: {
    validate: (val) => val.startsWith('https://') && val.includes('.supabase.co'),
    error: 'Must be a valid Supabase URL'
  },
  VITE_SUPABASE_ANON_KEY: {
    validate: (val) => val.startsWith('eyJ'),
    error: 'Must be a valid JWT token'
  },
  VITE_STRIPE_PUBLIC_KEY: {
    validate: (val) => val.startsWith('pk_'),
    error: 'Must be a valid Stripe publishable key'
  }
};

function validateEnv() {
  console.log('🔍 Validating environment variables...\n');
  
  const errors = [];
  const warnings = [];
  const success = [];
  
  // Check required variables
  for (const [key, config] of Object.entries(requiredVars)) {
    const value = process.env[key];
    
    if (!value) {
      if (config.required) {
        errors.push(`❌ ${key}: Missing (required)`);
      } else {
        warnings.push(`⚠️  ${key}: Missing (optional)`);
      }
    } else if (config.validate && !config.validate(value)) {
      errors.push(`❌ ${key}: ${config.error}`);
    } else {
      // Mask sensitive values in output
      const masked = key.includes('SECRET') || key.includes('KEY') || key.includes('PASSWORD')
        ? `${value.substring(0, 10)}...`
        : value;
      success.push(`✅ ${key}: ${masked}`);
    }
  }
  
  // Check optional variables
  for (const [key, config] of Object.entries(optionalVars)) {
    const value = process.env[key];
    
    if (value && config.validate && !config.validate(value)) {
      warnings.push(`⚠️  ${key}: ${config.error}`);
    } else if (value) {
      const masked = key.includes('SECRET') || key.includes('KEY')
        ? `${value.substring(0, 10)}...`
        : value;
      success.push(`✅ ${key}: ${masked} (optional)`);
    }
  }
  
  // Print results
  if (success.length > 0) {
    console.log('✅ Valid variables:');
    success.forEach(msg => console.log(`   ${msg}`));
    console.log('');
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  Warnings:');
    warnings.forEach(msg => console.log(`   ${msg}`));
    console.log('');
  }
  
  if (errors.length > 0) {
    console.log('❌ Errors:');
    errors.forEach(msg => console.log(`   ${msg}`));
    console.log('');
    console.log('💡 Make sure to set all required variables in .env.local');
    process.exit(1);
  }
  
  console.log('✨ All environment variables are valid!\n');
  return true;
}

// Run validation
validateEnv();

export { validateEnv };

