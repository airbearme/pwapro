#!/bin/bash

# Clean Environment Variables Script for AirBear PWA
# This script removes outdated and duplicate environment variables

set -e

echo "🧹 Cleaning up AirBear PWA environment variables..."

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

# List of outdated/duplicate variables to remove
OUTDATED_VARS=(
    "PUBLIC_SUPABASE_PWA4_ANON_KEY"
    "STORAGE_POSTGRES_PASSWORD"
    "STORAGE_POSTGRES_DATABASE"
    "STORAGE_SUPABASE_SERVICE_ROLE_KEY"
    "STORAGE_POSTGRES_HOST"
    "STORAGE_SUPABASE_ANON_KEY"
    "STORAGE_POSTGRES_URL"
    "STORAGE_POSTGRES_PRISMA_URL"
    "STORAGE_SUPABASE_URL"
    "NEXT_PUBLIC_STORAGE_SUPABASE_URL"
    "STORAGE_POSTGRES_URL_NON_POOLING"
    "STORAGE_SUPABASE_JWT_SECRET"
    "STORAGE_POSTGRES_USER"
    "NEXT_PUBLIC_STORAGE_SUPABASE_ANON_KEY"
    "SUPABASE_URL"
    "SUPABASE_SERVICE_ROLE_KEY"
    "VITE_SUPABASE_URL"
    "VITE_SUPABASE_ANON_KEY"
    "NEXT_TELEMETRY_DISABLED"
    "NEXT_PUBLIC_ANALYTICS_ID"
    "IONOS_SFTP_HOST"
    "IONOS_SFTP_USER"
    "IONOS_SFTP_PASSWORD"
    "IONOS_REMOTE_BASE"
)

# Check if Vercel CLI is available
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI not found. Please install it first: npm i -g vercel"
    exit 1
fi

print_status "Removing outdated environment variables..."

for var in "${OUTDATED_VARS[@]}"; do
    print_status "Removing $var..."
    if vercel env rm "$var" --yes 2>/dev/null; then
        print_success "Removed $var"
    else
        print_warning "$var not found or already removed"
    fi
done

print_success "Environment cleanup complete! 🎉"
print_status "Now only the essential variables remain:"
echo "  ✅ NEXT_PUBLIC_SUPABASE_PWA4_URL"
echo "  ✅ NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY"
echo "  ✅ SUPABASE_PWA4_SERVICE_ROLE_KEY"
echo "  ✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
echo "  ✅ STRIPE_SECRET_KEY"
echo "  ✅ STRIPE_WEBHOOK_SECRET"
echo "  ✅ NEXT_PUBLIC_SITE_URL"
echo "  ✅ NODE_ENV"
