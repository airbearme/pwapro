#!/bin/bash

# Script to add all required environment variables to Vercel production
# Run this from your project root directory

echo "🐻 Adding AirBear PWA environment variables to Vercel..."
echo "========================================================"

# Array of environment variables to add
declare -a env_vars=(
    "NEXT_PUBLIC_SUPABASE_PWA4_URL=https://fofmrqgcidfenbevayrg.supabase.co"
    "NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZm1ycWdjaWRmZW5iZXZheXJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MzQ3MjgsImV4cCI6MjA3OTIxMDcyOH0.Z6m5z1KQGp-cDjBbcdJjUaXIA25C3VD8IlcLge1fWyM"
    "SUPABASE_PWA4_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZm1ycWdjaWRmZW5iZXZheXJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzYzNDcyOCwiZXhwIjoyMDc5MjEwNzI4fQ.89Y4IOCpB-Ky1qjTJLmotMBe8RqQyN8bk6Xp5F43MMA"
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51RzDHKKPp8gF577PnHEhuO3X7zbzdTe2c25Z02PlMcc5DXAjs4odL16Rtx8cJ8evlUrRAcJYHrR7tFS8P7y4SC7t00lvh2rk7h"
    "STRIPE_SECRET_KEY=sk_live_... (your Stripe secret key)"
    "STRIPE_WEBHOOK_SECRET=whsec_EupLbUBGL8x5krgISkqfBgLjXpktz5cL"
    "SUPABASE_URL=https://fofmrqgcidfenbevayrg.supabase.co"
    "SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZm1ycWdjaWRmZW5iZXZheXJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzYzNDcyOCwiZXhwIjoyMDc5MjEwNzI4fQ.89Y4IOCpB-Ky1qjTJLmotMBe8RqQyN8bk6Xp5F43MMA"
    "VITE_SUPABASE_URL=https://fofmrqgcidfenbevayrg.supabase.co"
    "VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZm1ycWdjaWRmZW5iZXZheXJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MzQ3MjgsImV4cCI6MjA3OTIxMDcyOH0.Z6m5z1KQGp-cDjBbcdJjUaXIA25C3VD8IlcLge1fWyM"
    "NEXT_PUBLIC_SITE_URL=https://airbear.me"
)

# Add each environment variable
for env_var in "${env_vars[@]}"; do
    # Split into key and value
    key=$(echo "$env_var" | cut -d'=' -f1)
    value=$(echo "$env_var" | cut -d'=' -f2-)

    echo "Adding: $key"

    # Use Vercel CLI to add the environment variable
    if vercel env add "$key" production <<< "$value" 2>/dev/null; then
        echo "✅ Added: $key"
    else
        echo "❌ Failed to add: $key"
        echo "You may need to run: vercel login"
        exit 1
    fi
done

echo ""
echo "🎉 All environment variables added successfully!"
echo ""
echo "Next steps:"
echo "1. Deploy to production: vercel --prod"
echo "2. Test the live site: curl https://airbear.me/api/health"
echo ""
echo "Expected health check response:"
echo '{'
echo '  "status": "healthy",'
echo '  "checks": {'
echo '    "environment": {"status": "healthy"},'
echo '    "supabase": {"status": "healthy"},'
echo '    "stripe": {"status": "healthy"}'
echo '  }'
echo '}'
