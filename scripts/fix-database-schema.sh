#!/bin/bash

# Database Schema Fix Script
# This script ensures the database schema matches the application expectations

echo "🔧 Fixing Database Schema..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_status "The booking error is likely due to schema mismatch."
print_status "Let's check if we need to update the database schema..."

echo ""
print_warning "📋 Manual Steps Required:"
echo ""
echo "1. Go to your Supabase Dashboard:"
echo "   https://supabase.com/dashboard/project/fofmrqgcidfenbevayrg"
echo ""
echo "2. Navigate to: Database → SQL Editor"
echo ""
echo "3. Run this SQL to check the current rides table structure:"
echo "   SELECT column_name, data_type FROM information_schema.columns"
echo "   WHERE table_name = 'rides' ORDER BY ordinal_position;"
echo ""
echo "4. If the column 'distance' doesn't exist, run this:"
echo ""
echo "   -- Add missing distance column if it doesn't exist"
echo "   DO \$\$ BEGIN"
echo "     IF NOT EXISTS (SELECT 1 FROM information_schema.columns"
echo "                      WHERE table_name = 'rides' AND column_name = 'distance') THEN"
echo "       ALTER TABLE rides ADD COLUMN distance DECIMAL(8,2);"
echo "     END IF;"
echo "   END \$\$;"
echo ""
echo "   -- Remove incorrect distance_km column if it exists"
echo "   DO \$\$ BEGIN"
echo "     IF EXISTS (SELECT 1 FROM information_schema.columns"
echo "                    WHERE table_name = 'rides' AND column_name = 'distance_km') THEN"
echo "       ALTER TABLE rides DROP COLUMN distance_km;"
echo "     END IF;"
echo "   END \$\$;"
echo ""
echo "5. Verify the table structure:"
echo "   SELECT column_name, data_type FROM information_schema.columns"
echo "   WHERE table_name = 'rides' ORDER BY ordinal_position;"
echo ""
echo "6. Check if dropoff_spot_id exists:"
echo "   SELECT column_name FROM information_schema.columns"
echo "   WHERE table_name = 'rides' AND column_name = 'dropoff_spot_id';"
echo ""
print_success "After running these SQL commands, the booking should work!"
echo ""
print_status "The API has been fixed to use the correct column names:"
echo "   ✅ Using 'distance' instead of 'distance_km'"
echo "   ✅ Using 'dropoff_spot_id' (which should exist)"
echo "   ✅ Removed automatic created_at (uses database default)"
