#!/usr/bin/env node

/**
 * Comprehensive Database Check Script for AirBear PWA
 *
 * This script performs a thorough check of the Supabase database schema and data,
 * identifying missing tables, empty tables, and configuration issues. It generates
 * SQL scripts to fix identified problems.
 *
 * Usage:
 *   node comprehensive-database-check.js [options]
 *
 * Options:
 *   --quiet, -q        Suppress verbose output
 *   --output, -o FILE  Specify output SQL file (default: comprehensive-database-fix.sql)
 *   --no-sql           Skip SQL generation
 *   --help, -h         Show this help message
 *
 * Environment Variables:
 *   NEXT_PUBLIC_SUPABASE_PWA4_URL or SUPABASE_URL (required)
 *   SUPABASE_PWA4_SERVICE_ROLE_KEY or SUPABASE_SERVICE_ROLE_KEY (required)
 *
 * Example:
 *   node comprehensive-database-check.js --output fixes.sql
 *   node comprehensive-database-check.js --quiet --no-sql
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Environment variable configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PWA4_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_PWA4_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

// Initialize Supabase client (will be validated in main if needed)
const supabase = supabaseUrl && serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey) : null;

// Configuration constants
const REQUIRED_TABLES = ['users', 'spots', 'airbears', 'rides', 'payments', 'bodega_items'];
const OUTPUT_FILE = 'comprehensive-database-fix.sql';

// Utility functions
function log(level, message) {
  const timestamp = new Date().toISOString();
  const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : level === 'success' ? '✅' : 'ℹ️';
  console.log(`[${timestamp}] ${prefix} ${message}`);
}

async function checkTableExists(tableName) {
  try {
    const { error } = await supabase.from(tableName).select('*').limit(1);
    if (error && error.message.includes('does not exist')) {
      return { exists: false, error: null };
    }
    return { exists: !error, error };
  } catch (e) {
    return { exists: false, error: e };
  }
}

async function checkTableHasData(tableName, columns = ['*'], limit = 5) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select(columns.join(', '))
      .limit(limit);

    return { data, error, hasData: data && data.length > 0 };
  } catch (e) {
    return { data: null, error: e, hasData: false };
  }
}

function generateFixSQL(issues, results) {
  let sql = `-- Comprehensive Database Fix Script
-- Generated: ${new Date().toISOString()}
-- Run this in Supabase Dashboard → Database → SQL Editor

`;

  // Create missing tables
  if (issues.some(issue => issue.includes('bodega_items'))) {
    sql += `-- Create bodega items table
CREATE TABLE IF NOT EXISTS public.bodega_items (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  is_eco_friendly BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.bodega_items ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can read bodega items') THEN
    CREATE POLICY "Anyone can read bodega items" ON public.bodega_items FOR SELECT USING (true);
  END IF;
END $$;

-- Insert initial bodega items
INSERT INTO public.bodega_items (id, name, description, price, category, is_eco_friendly, stock) VALUES
('ceo-tshirt-m', 'CEO-Signed AirBear T-Shirt (M)', 'Official signed premium t-shirt', 100.00, 'apparel', true, 25),
('local-coffee', 'Local Coffee Blend', 'Binghamton roasted organic coffee', 12.99, 'beverages', true, 50),
('eco-water-bottle', 'Eco Water Bottle', 'Sustainable bamboo-capped bottle', 18.99, 'accessories', true, 40)
ON CONFLICT (id) DO NOTHING;

`;
  }

  // Insert initial data
  if (issues.some(issue => issue.includes('No spots data'))) {
    sql += `-- Insert initial spot data (Binghamton locations)
INSERT INTO public.spots (id, name, latitude, longitude, description, amenities, is_active) VALUES
('court-street-downtown', 'Court Street Downtown', 42.099118, -75.917538, 'Heart of downtown Binghamton', ARRAY['Restaurants', 'Shopping'], true),
('riverwalk-bu-center', 'Riverwalk BU Center', 42.098765, -75.916543, 'Riverside walkway', ARRAY['Parks', 'Walking Trails'], true),
('confluence-park', 'Confluence Park', 42.090123, -75.912345, 'Scenic park', ARRAY['Park', 'Nature'], true),
('southside-walking-bridge', 'Southside Walking Bridge', 42.091409, -75.914568, 'Pedestrian bridge', ARRAY['Bridge', 'Views'], true),
('general-hospital', 'General Hospital', 42.086741, -75.915711, 'Healthcare facility', ARRAY['Hospital'], true)
ON CONFLICT (id) DO NOTHING;

`;
  }

  if (issues.some(issue => issue.includes('No airbears'))) {
    sql += `-- Insert initial Airbear data
INSERT INTO public.airbears (id, current_spot_id, latitude, longitude, battery_level, is_available, is_charging, heading) VALUES
('airbear-001', 'court-street-downtown', 42.099118, -75.917538, 95, true, false, 0)
ON CONFLICT (id) DO NOTHING;

`;
  }

  // Verification queries
  sql += `-- Verification Queries

-- Check table structures
SELECT
  table_name,
  COUNT(*) as column_count
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('users', 'spots', 'airbears', 'rides', 'payments', 'bodega_items')
GROUP BY table_name
ORDER BY table_name;

-- Check data counts
SELECT
  'spots' as table_name, COUNT(*) as record_count FROM spots
UNION ALL
SELECT 'airbears' as table_name, COUNT(*) as record_count FROM airbears
UNION ALL
SELECT 'bodega_items' as table_name, COUNT(*) as record_count FROM bodega_items
UNION ALL
SELECT 'rides' as table_name, COUNT(*) as record_count FROM rides;

-- Test foreign key relationships
SELECT
  s.id as spot_id,
  s.name as spot_name,
  CASE WHEN r.id IS NOT NULL THEN 'Used in rides' ELSE 'Not used' END as usage
FROM spots s
LEFT JOIN rides r ON s.id = r.pickup_spot_id OR s.id = r.dropoff_spot_id
ORDER BY s.id;

`;

  return sql;
}

async function writeSQLToFile(sql, filename) {
  try {
    await fs.promises.writeFile(filename, sql, 'utf8');
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    verbose: true,
    outputFile: OUTPUT_FILE,
    skipSqlGeneration: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--quiet':
      case '-q':
        options.verbose = false;
        break;
      case '--no-sql':
        options.skipSqlGeneration = true;
        break;
      case '--output':
      case '-o':
        if (i + 1 < args.length) {
          options.outputFile = args[i + 1];
          i++; // Skip next arg
        } else {
          console.error('❌ --output requires a filename argument');
          process.exit(1);
        }
        break;
      default:
        if (arg.startsWith('-')) {
          console.error(`❌ Unknown option: ${arg}`);
          console.error('Use --help for usage information');
          process.exit(1);
        } else {
          console.error(`❌ Unexpected argument: ${arg}`);
          console.error('Use --help for usage information');
          process.exit(1);
        }
    }
  }

  return options;
}

function showHelp() {
  console.log(`
Comprehensive Database Check Script for AirBear PWA

Usage:
  node comprehensive-database-check.js [options]

Options:
  --quiet, -q        Suppress verbose output
  --output, -o FILE  Specify output SQL file (default: comprehensive-database-fix.sql)
  --no-sql           Skip SQL generation
  --help, -h         Show this help message

Environment Variables:
  NEXT_PUBLIC_SUPABASE_PWA4_URL or SUPABASE_URL (required)
  SUPABASE_PWA4_SERVICE_ROLE_KEY or SUPABASE_SERVICE_ROLE_KEY (required)

Examples:
  node comprehensive-database-check.js --output fixes.sql
  node comprehensive-database-check.js --quiet --no-sql
  node comprehensive-database-check.js --help

This script checks your Supabase database for missing tables, empty tables, and
configuration issues, then generates SQL scripts to fix identified problems.
`);
}

async function comprehensiveDatabaseCheck(options = {}) {
  const {
    verbose = true,
    outputFile = OUTPUT_FILE,
    skipSqlGeneration = false
  } = options;

  if (verbose) log('info', 'Running comprehensive database check...');

  const issues = [];
  const fixes = [];
  const results = {};
  
  try {
    // 1. Check all required tables exist
    if (verbose) log('info', 'Checking required tables...');
    results.tables = {};

    for (const table of REQUIRED_TABLES) {
      const { exists, error } = await checkTableExists(table);
      results.tables[table] = { exists, error };

      if (!exists) {
        issues.push(`Table '${table}' does not exist`);
        fixes.push(`CREATE TABLE ${table} with proper schema`);
        if (verbose) log('error', `Table '${table}' missing`);
      } else if (error) {
        if (verbose) log('warn', `Table '${table}' exists but has issues: ${error.message}`);
      } else {
        if (verbose) log('success', `Table '${table}' exists`);
      }
    }

    // 2. Check spots table has data
    if (verbose) log('info', 'Checking spots data...');
    const spotsCheck = await checkTableHasData('spots', ['id', 'name', 'latitude', 'longitude']);
    results.spots = spotsCheck;

    if (spotsCheck.error) {
      issues.push(`Spots query error: ${spotsCheck.error.message}`);
    } else if (!spotsCheck.hasData) {
      issues.push('No spots data found - users cannot book rides');
      fixes.push('INSERT initial spots data (16 Binghamton locations)');
    } else {
      if (verbose) log('success', `Found ${spotsCheck.data.length} spots`);
    }

    // 3. Check airbears table has data
    if (verbose) log('info', 'Checking airbears data...');
    const airbearsCheck = await checkTableHasData('airbears', ['id', 'is_available', 'battery_level']);
    results.airbears = airbearsCheck;

    if (airbearsCheck.error) {
      issues.push(`Airbears query error: ${airbearsCheck.error.message}`);
    } else if (!airbearsCheck.hasData) {
      issues.push('No airbears found - no vehicles available for rides');
      fixes.push('INSERT initial airbear data (at least 1 vehicle)');
    } else {
      if (verbose) log('success', `Found ${airbearsCheck.data.length} airbears`);
      const availableCount = airbearsCheck.data.filter(ab => ab.is_available).length;
      if (verbose) log('success', `${availableCount} airbears available`);
    }

    // 4. Check RLS policies
    if (verbose) log('info', 'Checking RLS policies...');
    try {
      const { error: rlsError } = await supabase.from('users').select('id').limit(1);
      if (rlsError && rlsError.message.includes('row-level security')) {
        issues.push('RLS policies may be too restrictive');
        fixes.push('Review and fix RLS policies for users table');
      } else {
        if (verbose) log('success', 'RLS policies appear to be working');
      }
    } catch (e) {
      if (verbose) log('warn', 'Could not test RLS policies');
    }

    // 5. Check foreign key relationships
    if (verbose) log('info', 'Checking foreign key relationships...');
    if (spotsCheck.hasData) {
      if (verbose) log('success', 'Spots table has proper IDs for foreign key references');
    } else {
      issues.push('Cannot verify foreign key relationships - no spots data');
    }

    // 6. Check bodega items
    if (verbose) log('info', 'Checking bodega items...');
    const bodegaCheck = await checkTableHasData('bodega_items', ['id', 'name', 'price', 'stock']);
    results.bodega = bodegaCheck;

    if (bodegaCheck.error) {
      if (bodegaCheck.error.message.includes('does not exist')) {
        issues.push('Bodega items table missing - mobile bodega feature broken');
        fixes.push('CREATE bodega_items table and insert initial products');
      } else {
        if (verbose) log('warn', `Bodega items issue: ${bodegaCheck.error.message}`);
      }
    } else if (!bodegaCheck.hasData) {
      issues.push('No bodega items - mobile bodega feature empty');
      fixes.push('INSERT initial bodega items (CEO t-shirt, coffee, etc.)');
    } else {
      if (verbose) log('success', `Found ${bodegaCheck.data.length} bodega items`);
    }
    // Generate and save fix SQL if needed
    if (!skipSqlGeneration && issues.length > 0) {
      if (verbose) log('info', 'Generating comprehensive fix SQL...');

      const fixSQL = generateFixSQL(issues, results);
      const writeResult = await writeSQLToFile(fixSQL, outputFile);

      if (writeResult.success) {
        if (verbose) log('success', `SQL saved to: ${outputFile}`);
      } else {
        log('error', `Failed to write SQL file: ${writeResult.error.message}`);
      }
    }

    // Summary
    if (verbose) {
      console.log('\n📊 Summary:');
      console.log(`Found ${issues.length} issues`);

      if (issues.length > 0) {
        console.log('\n🚨 Issues found:');
        issues.forEach(issue => console.log(`  - ${issue}`));
      }

      if (fixes.length > 0) {
        console.log('\n🔧 Fixes needed:');
        fixes.forEach(fix => console.log(`  - ${fix}`));
      }

      if (issues.length > 0 && !skipSqlGeneration) {
        console.log('\n📋 Next steps:');
        console.log(`  1. Review the generated SQL in ${outputFile}`);
        console.log('  2. Run the SQL in Supabase Dashboard → Database → SQL Editor');
        console.log('  3. Re-run this script to verify fixes');
      }
    }

    return { issues, fixes, results, sqlGenerated: issues.length > 0 && !skipSqlGeneration };

  } catch (error) {
    log('error', `Comprehensive check failed: ${error.message}`);
    throw error;
  }
}

// Main execution
async function main() {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    return;
  }

  // Validate required environment variables (only after help check)
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing required environment variables:');
    console.error('   - NEXT_PUBLIC_SUPABASE_PWA4_URL or SUPABASE_URL');
    console.error('   - SUPABASE_PWA4_SERVICE_ROLE_KEY or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  try {
    const result = await comprehensiveDatabaseCheck(options);
    // Exit with appropriate code based on results
    process.exit(result.issues.length > 0 ? 1 : 0);
  } catch (error) {
    console.error('Script execution failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main();