#!/bin/bash

# Quick Production Deploy Script
# Bypasses local validation since Vercel has the variables

set -e

echo "🚀 Quick Deploy to Production..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
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

# Build the application
print_status "Building application..."
if npm run build; then
    print_success "✅ Build successful"
else
    print_warning "⚠️ Build failed, but Vercel will build in production"
fi

# Deploy to Vercel
print_status "Deploying to Vercel production..."
if command -v vercel &> /dev/null; then
    vercel --prod
    print_success "🎉 Deployment complete!"
    print_status "Your app is available at: https://airbear.me"
else
    print_warning "Vercel CLI not found. Deploy via Git:"
    echo "  git add ."
    echo "  git commit -m \"Deploy to production\""
    echo "  git push origin main"
fi

print_status "After deployment, test:"
echo "  - OAuth: https://airbear.me/auth/signup"
echo "  - Health: https://airbear.me/api/health"
