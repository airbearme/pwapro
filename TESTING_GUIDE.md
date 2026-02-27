# 🧪 AirBear PWA Testing Guide

Complete testing guide for all features before production deployment.

---

## Quick Test Commands

```bash
# Type check
npm run type-check

# Lint check
npm run lint

# Build test
npm run build

# Run all verification
npm run verify

# Production endpoint tests
npm run test:production https://airbear.me

# Sync to GitHub
npm run sync:github
```

---

## 🗺️ Real-time Map Testing

### Manual Test Steps

1. **Initial Load**

   ```
   ✓ Navigate to /map
   ✓ Map loads within 2 seconds
   ✓ No console errors
   ✓ Leaflet CSS loads properly
   ```

2. **Marker Display**

   ```
   ✓ AirBear markers appear (🚲 icon)
   ✓ Spot markers appear (🐻 icon)
   ✓ Markers have correct colors
   ✓ Available markers are green
   ✓ Unavailable markers are gray
   ```

3. **Real-time Updates**

   ```
   ✓ Open browser DevTools → Network tab
   ✓ See WebSocket connection to Supabase
   ✓ Update airbear location in Supabase dashboard
   ✓ Marker moves on map within 1-2 seconds
   ✓ No page refresh needed
   ```

4. **Interactive Features**
   ```
   ✓ Click on AirBear marker → popup appears
   ✓ Popup shows battery level
   ✓ Popup shows availability status
   ✓ Click on Spot marker → popup appears
   ✓ Popup shows available AirBears count
   ```

### Console Commands for Testing

```javascript
// Open browser console on /map page

// 1. Check if Supabase client exists
console.log("[v0] Supabase:", window.supabase ? "✓ Connected" : "✗ Not found")

// 2. Check realtime subscriptions
console.log("[v0] Realtime:", "Check Network tab for WebSocket")

// 3. Manually trigger location update (in Supabase SQL Editor)
UPDATE airbears
SET latitude = latitude + 0.001,
    longitude = longitude + 0.001,
    updated_at = NOW()
WHERE id = 'your-airbear-id';
```

---

## 🔐 Authentication Testing

### Google Sign-In

1. **Setup Check**

   ```
   ✓ Supabase dashboard → Authentication → Providers
   ✓ Google OAuth is enabled
   ✓ Client ID and Secret are set
   ✓ Redirect URL: https://airbear.me/auth/callback
   ```

2. **Test Flow**

   ```
   ✓ Visit /auth/login
   ✓ Click "Continue with Google"
   ✓ Redirects to Google login
   ✓ Select Google account
   ✓ Redirects back to /auth/callback
   ✓ Then redirects to /dashboard or /map
   ✓ User is logged in
   ```

3. **Verify Profile Created**
   ```sql
   -- In Supabase SQL Editor
   SELECT * FROM profiles WHERE email = 'your-test@gmail.com';
   -- Should return 1 row
   ```

### Apple Sign-In

1. **Setup Check**

   ```
   ✓ Supabase dashboard → Authentication → Providers
   ✓ Apple OAuth is enabled
   ✓ Service ID and Key are set
   ✓ Redirect URL: https://airbear.me/auth/callback
   ```

2. **Test Flow** (on Safari/iOS)
   ```
   ✓ Visit /auth/login
   ✓ Click "Continue with Apple"
   ✓ Redirects to Apple login
   ✓ Use Face ID / Touch ID
   ✓ Redirects back to app
   ✓ User is logged in
   ```

### Email/Password

1. **Sign Up**

   ```
   ✓ Visit /auth/signup
   ✓ Enter email and password
   ✓ Click "Sign Up"
   ✓ Check email for confirmation (if enabled)
   ✓ Profile created in database
   ```

2. **Sign In**
   ```
   ✓ Visit /auth/login
   ✓ Enter credentials
   ✓ Click "Sign In"
   ✓ Redirects to dashboard
   ```

---

## 💳 Stripe Payment Testing

### Setup Verification

1. **Stripe Dashboard**

   ```
   ✓ Login to dashboard.stripe.com
   ✓ Switch to Test Mode (toggle in sidebar)
   ✓ Developers → API Keys → Copy test keys
   ✓ Developers → Webhooks → Verify endpoint exists
   ✓ Endpoint: https://airbear.me/api/stripe/webhook
   ✓ Status: Active (green checkmark)
   ```

2. **Environment Variables**
   ```bash
   # Verify in Vercel dashboard
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### Test Payments

1. **Credit Card Payment**

   ```
   ✓ Visit /products
   ✓ Click "Buy Now" on any product
   ✓ Redirects to Stripe Checkout
   ✓ Enter test card: 4242 4242 4242 4242
   ✓ Expiry: Any future date
   ✓ CVC: Any 3 digits
   ✓ Click "Pay"
   ✓ Redirects to success page
   ✓ Order created in database
   ```

2. **Apple Pay** (Safari/iOS only)

   ```
   ✓ Visit /products on iOS Safari
   ✓ Click "Buy Now"
   ✓ Apple Pay button appears
   ✓ Click Apple Pay button
   ✓ Use Face ID / Touch ID
   ✓ Payment completes
   ```

3. **Google Pay** (Chrome/Android)
   ```
   ✓ Visit /products on Chrome
   ✓ Click "Buy Now"
   ✓ Google Pay button appears
   ✓ Click Google Pay
   ✓ Confirm payment
   ✓ Payment completes
   ```

### Webhook Testing

```bash
# In terminal, listen to Stripe webhooks
stripe listen --forward-to localhost:3000/api/stripe/webhook

# In another terminal, trigger test events
stripe trigger checkout.session.completed
stripe trigger payment_intent.succeeded
```

### Test Cards

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
Insufficient Funds: 4000 0000 0000 9995
```

---

## 🔒 Security Testing

### RLS Policies

```sql
-- Test in Supabase SQL Editor with different user contexts

-- 1. Test as anonymous user
SELECT * FROM profiles;
-- Should return NO rows

-- 2. Test as authenticated user
SELECT * FROM profiles WHERE id = auth.uid();
-- Should return ONLY your profile

-- 3. Test insert (should fail for other users)
INSERT INTO profiles (id, email) VALUES ('random-id', 'test@test.com');
-- Should ERROR: "new row violates row-level security policy"

-- 4. Test airbears table (public read)
SELECT * FROM airbears;
-- Should return all rows (public readable)

-- 5. Test orders table (own orders only)
SELECT * FROM orders WHERE user_id = auth.uid();
-- Should return only YOUR orders
```

### Environment Variable Security

```bash
# Verify no secrets in client bundle
npm run build
grep -r "sk_live_" .next/static
# Should return NO results

grep -r "SERVICE_ROLE" .next/static
# Should return NO results
```

---

## 📱 Mobile Testing

### Responsive Design

1. **Chrome DevTools**

   ```
   ✓ Open DevTools (F12)
   ✓ Click device toggle (Ctrl+Shift+M)
   ✓ Test iPhone 12 Pro
   ✓ Test iPad
   ✓ Test Samsung Galaxy
   ✓ All pages responsive
   ```

2. **Real Devices**
   ```
   ✓ Test on actual iPhone
   ✓ Test on actual Android
   ✓ Touch interactions work
   ✓ Buttons are tappable
   ✓ No horizontal scroll
   ```

### PWA Installation

1. **iOS Safari**

   ```
   ✓ Visit airbear.me
   ✓ Tap Share button
   ✓ Tap "Add to Home Screen"
   ✓ Icon appears on home screen
   ✓ Tap icon → app opens fullscreen
   ```

2. **Android Chrome**
   ```
   ✓ Visit airbear.me
   ✓ See "Install" prompt
   ✓ Tap "Install"
   ✓ App installs
   ✓ Opens as standalone app
   ```

---

## 🚀 Performance Testing

### Lighthouse Audit

```bash
# In Chrome DevTools
1. Open DevTools (F12)
2. Click "Lighthouse" tab
3. Select "Mobile" and all categories
4. Click "Analyze page load"

Target Scores:
✓ Performance: > 90
✓ Accessibility: > 95
✓ Best Practices: > 95
✓ SEO: > 90
```

### Load Testing

```bash
# Install k6 (load testing tool)
brew install k6

# Run load test
k6 run tests/load-test.js
```

---

## ✅ Pre-Deployment Checklist

```
Environment:
[ ] All environment variables set in Vercel
[ ] HTTPS enabled on custom domain
[ ] Domain DNS configured correctly

Database:
[ ] SQL schema executed in Supabase
[ ] RLS policies enabled on all tables
[ ] Realtime enabled for required tables
[ ] Sample data added for testing

Authentication:
[ ] Google OAuth configured
[ ] Apple OAuth configured
[ ] Redirect URLs set correctly
[ ] Email templates customized (optional)

Payments:
[ ] Stripe webhook created
[ ] Webhook secret added to env vars
[ ] Test mode payments working
[ ] Ready to switch to live mode

Testing:
[ ] npm run verify passes
[ ] npm run test:production passes
[ ] Manual testing completed
[ ] Mobile testing completed
[ ] Real-time updates working

Deployment:
[ ] Code pushed to GitHub
[ ] GitHub Actions workflow running
[ ] Vercel deployment successful
[ ] Custom domain accessible
```

---

## 🐛 Common Issues & Fixes

### Map Not Loading

**Issue:** Blank white box instead of map

**Fix:**

```typescript
// Check app/globals.css has Leaflet styles
@import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');

// Check map-view.tsx loads Leaflet dynamically
const MapComponent = dynamic(() => import("@/components/map-view"), {
  ssr: false
})
```

### OAuth Redirect Loop

**Issue:** Keeps redirecting after OAuth login

**Fix:**

```typescript
// Check middleware.ts doesn't block auth callback
export const config = {
  matcher: ["/((?!api|auth|_next/static|_next/image|favicon.ico).*)"],
}
```

### Stripe Webhook Fails

**Issue:** Payments work but orders not created

**Fix:**

```bash
# Verify webhook signature
# In app/api/stripe/webhook/route.ts
const sig = headers().get('stripe-signature')
stripe.webhooks.constructEvent(body, sig, webhookSecret)
```

### Real-time Not Updating

**Issue:** Map doesn't update locations

**Fix:**

```sql
-- Enable realtime in Supabase
ALTER PUBLICATION supabase_realtime ADD TABLE airbears;

-- Check RLS allows reads
CREATE POLICY "Allow public read" ON airbears FOR SELECT USING (true);
```

---

## 📞 Support Resources

- Vercel: vercel.com/help
- Supabase: supabase.com/support
- Stripe: support.stripe.com
- Next.js: nextjs.org/docs

---

**Ready to deploy!** Run `npm run sync:github` to push to production.
