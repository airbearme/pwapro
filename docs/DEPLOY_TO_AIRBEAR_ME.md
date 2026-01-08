# Deploy to airbear.me - Complete Guide

This guide will walk you through deploying the AirBear PWA to production at airbear.me with full real-time map tracking, authentication, and payment processing.

## Prerequisites

- GitHub account with access to github.com/airbearme/pwapro (or pwa5)
- Vercel account connected to your GitHub
- Domain airbear.me configured and pointing to Vercel
- Supabase pwapro instance with database initialized
- Stripe account for payment processing

## Step 1: Verify Environment Variables

Ensure all environment variables are set in Vercel:

### Supabase (pwapro Instance)
\`\`\`bash
NEXT_PUBLIC_SUPABASE_PWAPRO_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PWAPRO_ANON_KEY=your_anon_key
SUPABASE_PWAPRO_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

### Stripe
\`\`\`bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
\`\`\`

### OAuth (for Google/Apple Sign-In)
Configure in Supabase Dashboard:
- Google: Add OAuth client credentials
- Apple: Add Sign in with Apple credentials

## Step 2: Initialize Supabase Database

Run the database setup script to create all tables with RLS policies:

\`\`\`bash
# Connect to your Supabase project
psql postgres://[YOUR_CONNECTION_STRING]

# Run the schema
\i scripts/01-setup-database.sql
\`\`\`

Or use the Supabase SQL Editor to paste the contents of `scripts/01-setup-database.sql`

## Step 3: Configure Domain in Vercel

1. Go to your Vercel project settings
2. Navigate to Domains
3. Add `airbear.me` and `www.airbear.me`
4. Configure DNS:
   - Add A record: `76.76.19.19`
   - Add CNAME for www: `cname.vercel-dns.com`

## Step 4: Configure OAuth Redirect URLs

In Supabase Dashboard → Authentication → URL Configuration:

**Authorized URLs:**
- `https://airbear.me`
- `https://www.airbear.me`
- `https://airbear.me/auth/callback`
- `http://localhost:3000` (for development)

## Step 5: Setup Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://airbear.me/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy webhook secret to Vercel env vars

## Step 6: Deploy via GitHub Actions

The repository includes automated deployment via GitHub Actions. Every push to `main` triggers:

1. Dependency installation
2. Type checking
3. Build process
4. Deployment to Vercel
5. Health check verification

To deploy manually:
\`\`\`bash
git push origin main
\`\`\`

## Step 7: Verify Deployment

### Check Health Endpoint
\`\`\`bash
curl https://airbear.me/api/health
\`\`\`

Expected response:
\`\`\`json
{
  "status": "healthy",
  "timestamp": "2025-01-XX...",
  "services": {
    "database": "connected",
    "stripe": "configured",
    "auth": "ready"
  }
}
\`\`\`

### Test Map Display
1. Navigate to `https://airbear.me/map`
2. Verify map loads without errors
3. Check browser console for any warnings
4. Confirm real-time updates work (markers animate)

### Test Authentication
1. Go to `https://airbear.me/auth/login`
2. Test Google Sign-In
3. Test Apple Sign-In (if configured)
4. Verify profile creation in Supabase

### Test Payments
1. Navigate to products page
2. Add item to cart
3. Proceed to checkout
4. Test with Stripe test card: `4242 4242 4242 4242`
5. Verify webhook receives event

## Step 8: Monitor Real-Time Features

### Map Tracking
- Open map page on multiple devices
- Verify locations update across all clients
- Check that battery levels display correctly
- Confirm available vs in-use states

### Database Subscriptions
Check Supabase Dashboard → Database → Replication:
- Ensure `airbears` table has realtime enabled
- Verify `spots` table has realtime enabled
- Check `rides` table has realtime enabled

## Troubleshooting

### Map Not Displaying
1. Check browser console for Leaflet errors
2. Verify CDN access to OpenStreetMap tiles
3. Confirm latitude/longitude values are valid
4. Check that `leaflet` package is installed

### Real-Time Updates Not Working
1. Verify Supabase realtime is enabled
2. Check WebSocket connection in Network tab
3. Confirm RLS policies allow SELECT
4. Test database trigger functions

### Authentication Issues
1. Verify OAuth redirect URLs match exactly
2. Check Supabase Auth logs
3. Confirm environment variables are correct
4. Test with incognito mode

### Payment Failures
1. Check Stripe webhook logs
2. Verify webhook secret matches
3. Confirm Stripe keys are production keys
4. Test webhook locally with Stripe CLI

## Performance Optimization

### Enable Vercel Edge Functions
Configure in `vercel.json` for faster API responses near users.

### PWA Configuration
The app includes service workers for offline functionality:
- Cached routes work offline
- Map tiles cache for offline viewing
- Background sync for ride updates

### CDN and Caching
- Static assets are served from Vercel CDN
- API routes use Edge caching where appropriate
- Database queries use Supabase connection pooling

## Security Checklist

- [ ] All environment variables use production values
- [ ] RLS policies are enabled on all tables
- [ ] Stripe webhook signature verification is active
- [ ] OAuth secrets are not exposed in client code
- [ ] HTTPS is enforced (no HTTP access)
- [ ] Rate limiting is configured for API routes
- [ ] CORS is properly configured

## Monitoring

### Setup Vercel Analytics
Already included via `@vercel/analytics` package.

### Monitor Supabase
- Check query performance in Dashboard
- Monitor connection pool usage
- Set up alerts for high error rates

### Track Stripe Events
- Monitor payment success rate
- Check for failed webhooks
- Set up Stripe Radar for fraud detection

## Continuous Updates

The CI/CD pipeline automatically:
1. Runs tests on every commit
2. Deploys to preview URL for PRs
3. Deploys to production on main branch merge
4. Sends deployment notifications

To update the app:
\`\`\`bash
git add .
git commit -m "Update feature"
git push origin main
\`\`\`

Deployment typically takes 2-3 minutes.

## Support

If you encounter issues:
1. Check deployment logs in Vercel
2. Review Supabase logs for database errors
3. Check Stripe logs for payment issues
4. Review browser console for client errors

For critical issues, the health endpoint at `/api/health` provides system status.
