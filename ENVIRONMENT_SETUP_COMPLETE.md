# 🚀 Complete Environment Setup Guide - AirBear PWA

## ✅ What's Been Done

I've cleaned up and configured your environment variables:

### 1. **Cleaned .env.local** ✅
- Removed auto-managed `VERCEL_OIDC_TOKEN` (handled by Vercel)
- Kept only essential variables
- Created `.env.example` template for future reference

### 2. **Cleaned Vercel Environment Variables** ✅
- Removed 25+ outdated/duplicate variables
- Kept only 8 essential variables
- Variables are now properly organized

### 3. **Created Automation Scripts** ✅
- `scripts/setup-environment.sh` - One-command setup for all platforms
- `scripts/clean-env.sh` - Clean outdated variables
- `scripts/deploy-production.sh` - Production deployment

## 📋 Current Environment Variables

### Essential Variables (✅ Already Configured)
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_PWA4_URL=https://fofmrqgcidfenbevayrg.supabase.co
NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY=[Get from Supabase Dashboard → Project Settings → API]
SUPABASE_PWA4_SERVICE_ROLE_KEY=[Get from Supabase Dashboard → Project Settings → API]

# Stripe Configuration  
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[Get from Stripe Dashboard → Developers → API Keys]
STRIPE_SECRET_KEY=[Get from Stripe Dashboard → Developers → API Keys]
STRIPE_WEBHOOK_SECRET=[Get from Stripe Dashboard → Developers → Webhooks]

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://airbear.me
NODE_ENV=production
```

## 🔧 What You Need to Do

### **Step 1: Set Up GitHub Secrets** (Required for CI/CD)

Go to: https://github.com/airbearme/pwapro/settings/secrets/actions

Add these repository secrets:

1. `NEXT_PUBLIC_SUPABASE_PWA4_URL`
   ```
   https://fofmrqgcidfenbevayrg.supabase.co
   ```

2. `NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY`
   ```
   [Get from Supabase Dashboard → Project Settings → API]
   ```

3. `SUPABASE_PWA4_SERVICE_ROLE_KEY`
   ```
   [Get from Supabase Dashboard → Project Settings → API]
   ```

4. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   ```
   [Get from Stripe Dashboard → Developers → API Keys]
   ```

5. `STRIPE_SECRET_KEY`
   ```
   [Get from Stripe Dashboard → Developers → API Keys]
   ```

6. `STRIPE_WEBHOOK_SECRET`
   ```
   [Get from Stripe Dashboard → Developers → Webhooks]
   ```

7. `NEXT_PUBLIC_SITE_URL`
   ```
   https://airbear.me
   ```

### **Step 2: Configure Supabase Redirect URLs** (Required for OAuth)

Go to: https://supabase.com/dashboard/project/fofmrqgcidfenbevayrg/auth/url-configuration

**Site URL:**
```
https://airbear.me
```

**Redirect URLs (add all):**
```
http://localhost:3000/auth/callback
https://airbear.me/auth/callback
https://www.airbear.me/auth/callback
```

### **Step 3: Deploy to Production** 

```bash
# Option A: Use the production script
./scripts/deploy-production.sh

# Option B: Manual deployment
npm run build
git add .
git commit -m "Configure environment variables and deploy"
git push origin main
```

## 🎯 Quick Commands

```bash
# Validate environment
npm run check:supabase

# Setup all environments (if you have CLI tools)
./scripts/setup-environment.sh

# Clean outdated variables
./scripts/clean-env.sh

# Deploy to production
./scripts/deploy-production.sh
```

## ✅ Verification Checklist

After setup, verify these work:

- [ ] Local development: `npm run dev`
- [ ] Environment validation: `npm run check:supabase`
- [ ] Production build: `npm run build`
- [ ] GitHub Actions run successfully
- [ ] OAuth redirects work: https://airbear.me/auth/signup
- [ ] Health endpoint: https://airbear.me/api/health

## 🎉 Benefits

✅ **No more duplicate variables** - Clean environment across all platforms  
✅ **One-command setup** - Use `./scripts/setup-environment.sh` for future projects  
✅ **Automatic deployment** - GitHub Actions will deploy automatically  
✅ **Consistent configuration** - Same variables across local, GitHub, and Vercel  
✅ **Security maintained** - Sensitive keys properly stored as secrets  

---

**Your environment is now clean and ready for production!** 🚀

Just complete Steps 1-2 above and deploy!
