#!/bin/bash

# AirBear PWA Environment Setup Script
# This script sets up environment variables across all platforms

set -e

echo "🚀 Setting up AirBear PWA environment variables..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if .env.local exists
if [ ! -f .env.local ]; then
    print_error ".env.local not found! Please create it with your environment variables."
    exit 1
fi

# Source environment variables
set -a
source .env.local
set +a

# Validate required variables
print_status "Validating environment variables..."

required_vars=(
    "NEXT_PUBLIC_SUPABASE_PWA4_URL"
    "NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY"
    "SUPABASE_PWA4_SERVICE_ROLE_KEY"
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    "STRIPE_SECRET_KEY"
    "STRIPE_WEBHOOK_SECRET"
    "NEXT_PUBLIC_SITE_URL"
)

missing_vars=()
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    print_error "Missing required environment variables:"
    for var in "${missing_vars[@]}"; do
        echo "  - $var"
    done
    exit 1
fi

print_success "All required environment variables are set!"

# Setup GitHub Secrets
print_status "Setting up GitHub secrets..."

# Check if gh CLI is installed
if command -v gh &> /dev/null; then
    print_status "GitHub CLI found. Setting up secrets..."
    
    # Set GitHub secrets
    echo "$NEXT_PUBLIC_SUPABASE_PWA4_URL" | gh secret set NEXT_PUBLIC_SUPABASE_PWA4_URL --body -
    echo "$NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY" | gh secret set NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY --body -
    echo "$SUPABASE_PWA4_SERVICE_ROLE_KEY" | gh secret set SUPABASE_PWA4_SERVICE_ROLE_KEY --body -
    echo "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" | gh secret set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY --body -
    echo "$STRIPE_SECRET_KEY" | gh secret set STRIPE_SECRET_KEY --body -
    echo "$STRIPE_WEBHOOK_SECRET" | gh secret set STRIPE_WEBHOOK_SECRET --body -
    echo "$NEXT_PUBLIC_SITE_URL" | gh secret set NEXT_PUBLIC_SITE_URL --body -
    
    print_success "GitHub secrets configured!"
else
    print_warning "GitHub CLI not found. Please manually set secrets in GitHub repository settings:"
    echo "  https://github.com/airbearme/pwapro/settings/secrets/actions"
fi

# Setup Vercel Environment Variables
print_status "Setting up Vercel environment variables..."

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    print_status "Vercel CLI found. Setting up environment variables..."
    
    # Set Vercel environment variables for production
    vercel env add NEXT_PUBLIC_SUPABASE_PWA4_URL production
    vercel env add NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY production
    vercel env add SUPABASE_PWA4_SERVICE_ROLE_KEY production
    vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
    vercel env add STRIPE_SECRET_KEY production
    vercel env add STRIPE_WEBHOOK_SECRET production
    vercel env add NEXT_PUBLIC_SITE_URL production
    
    print_success "Vercel environment variables configured!"
else
    print_warning "Vercel CLI not found. Please manually set variables in Vercel dashboard:"
    echo "  https://vercel.com/dashboard"
fi

# Setup Supabase Redirect URLs
print_status "Configuring Supabase redirect URLs..."

if command -v supabase &> /dev/null; then
    print_status "Supabase CLI found. You may need to manually configure redirect URLs:"
    echo "  Go to: https://supabase.com/dashboard/project/your-project/auth/url-configuration"
    echo "  Site URL: https://airbear.me"
    echo "  Redirect URLs:"
    echo "    - http://localhost:3000/auth/callback"
    echo "    - https://airbear.me/auth/callback"
    echo "    - https://www.airbear.me/auth/callback"
else
    print_warning "Supabase CLI not found. Please manually configure redirect URLs:"
    echo "  Go to: https://supabase.com/dashboard/project/your-project/auth/url-configuration"
fi

# Test configuration
print_status "Testing configuration..."

# Run the Supabase check script
if [ -f scripts/check-supabase-config.js ]; then
    npm run check:supabase
fi

# Run environment validation
if [ -f scripts/validate-env.js ]; then
    npm run validate:env
fi

print_success "Environment setup complete! 🎉"
print_status "Next steps:"
echo "  1. Deploy to production: npm run deploy"
echo "  2. Test OAuth flow: https://airbear.me/auth/signup"
echo "  3. Verify all features work"

print_success "Your environment variables are now configured across:"
echo "  ✅ Local development (.env.local)"
echo "  ✅ GitHub Actions (secrets)"
echo "  ✅ Vercel (environment variables)"
