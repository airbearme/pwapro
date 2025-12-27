#!/bin/bash

# Script to set up GitHub repository and push code
# Usage: bash scripts/setup-github.sh

set -e

REPO_NAME="pwapro"
REPO_OWNER="airbearme"
REPO_URL="https://github.com/${REPO_OWNER}/${REPO_NAME}.git"

echo "🚀 Setting up GitHub repository: ${REPO_URL}"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Run 'git init' first."
    exit 1
fi

# Check if remote already exists
if git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  Remote 'origin' already exists. Updating..."
    git remote set-url origin "${REPO_URL}"
else
    echo "➕ Adding remote 'origin'..."
    git remote add origin "${REPO_URL}"
fi

# Set default branch to main
git branch -M main 2>/dev/null || true

# Stage all files
echo "📦 Staging files..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "ℹ️  No changes to commit."
else
    echo "💾 Committing changes..."
    git commit -m "Initial commit: AirBear PWA with CI/CD

- Complete PWA setup with Supabase and Stripe
- Real-time map tracking for Binghamton
- OAuth authentication (Google/Apple)
- Multiple payment methods (Stripe, Apple Pay, Google Pay, Cash)
- Push notifications for airbear availability
- GitHub Actions CI/CD workflows
- Production-ready deployment configuration"
fi

# Check if GitHub CLI is available
if command -v gh &> /dev/null; then
    echo "🔍 GitHub CLI found. Creating repository..."
    
    # Check if repo exists
    if gh repo view "${REPO_OWNER}/${REPO_NAME}" &> /dev/null; then
        echo "✅ Repository already exists at ${REPO_URL}"
    else
        echo "➕ Creating new repository..."
        gh repo create "${REPO_OWNER}/${REPO_NAME}" \
            --public \
            --description "AirBear PWA - Solar-Powered Rideshare & Mobile Bodega" \
            --source=. \
            --remote=origin \
            --push || {
            echo "⚠️  Failed to create via GitHub CLI. Repository may need to be created manually."
            echo "📝 Please create the repository at: ${REPO_URL}"
            echo "   Then run: git push -u origin main"
        }
    fi
else
    echo "⚠️  GitHub CLI not found. Please create the repository manually:"
    echo "   1. Go to https://github.com/new"
    echo "   2. Repository name: ${REPO_NAME}"
    echo "   3. Owner: ${REPO_OWNER}"
    echo "   4. Make it public"
    echo "   5. Don't initialize with README, .gitignore, or license"
    echo "   6. Then run: git push -u origin main"
fi

echo ""
echo "✅ GitHub setup complete!"
echo "📝 Next steps:"
echo "   1. Add secrets to GitHub repository:"
echo "      - Settings > Secrets and variables > Actions"
echo "      - Add: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID"
echo "      - Add all environment variables from .env.local"
echo "   2. Push code: git push -u origin main"

