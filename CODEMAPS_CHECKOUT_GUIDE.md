# CodeMaps Guide: Checkout & Driver AirBear Features

## Overview
This guide explains the CodeMaps configuration for debugging and understanding the checkout loading states and driver-specific AirBear management features.

## 🚀 Features Added

### 1. Checkout Flow (`checkoutFlow`)
**Purpose**: Debug payment processing and loading states

#### Key Components:
- `components/checkout-button.tsx` - Payment method buttons with loading states
- `app/checkout/page.tsx` - Main checkout page with payment form
- `app/api/stripe/create-payment-intent.ts` - Stripe payment intent creation
- `app/api/stripe/checkout/route.ts` - Stripe checkout session handling

#### Loading States to Monitor:
```typescript
// In checkout-button.tsx
const [loading, setLoading] = useState(false)
const [walletLoading, setWalletLoading] = useState({
  apple: false,
  google: false,
})

// In checkout/page.tsx  
const [loading, setLoading] = useState(true)
const [authLoading, setAuthLoading] = useState(false)
```

#### Debug Points:
- **authLoading**: Check if user authentication is stuck
- **paymentLoading**: Monitor Stripe API response times
- **walletLoading**: Verify Apple/Google Pay availability
- **stripeLoading**: Ensure Stripe SDK initialization

### 2. Driver AirBear Management (`driverAirbearManagement`)
**Purpose**: Track driver vehicle assignment and location updates

#### Key Components:
- `app/driver/page.tsx` - Driver dashboard with assigned AirBear
- `app/api/airbear/locations/route.ts` - API filtering by driver assignment
- `app/api/airbear/update-location/route.ts` - GPS location updates

#### API Endpoints:
```
GET /api/airbear/locations
- Filters AirBears by user role and assignment
- Returns isDriverView flag for UI handling
- Drivers see only their assigned vehicle

POST /api/airbear/update-location  
- Updates GPS coordinates for assigned AirBear
- Requires driver authentication
- Updates battery and heading data
```

#### Database Relations:
```sql
users.assigned_airbear_id → airbears.id
-- One driver can have one assigned AirBear
-- AirBear status: is_available, is_charging, battery_level
```

#### Debug Points:
- **userProfile**: Check `users.assigned_airbear_id` field
- **apiFiltering**: Verify role-based filtering works correctly
- **dashboardDisplay**: Ensure proper AirBear status display

### 3. Booking System (`bookingSystem`)
**Purpose**: Handle ride booking with proper AirBear availability

#### Key Components:
- `app/book/page.tsx` - Main booking interface
- `components/map-view-beautiful.tsx` - Map with AirBear locations
- `app/api/rides/create.ts` - Ride creation logic

#### AirBear Filtering Logic:
```typescript
// Driver view: Only assigned AirBear
if (userProfile?.role === "driver" && userProfile.assigned_airbear_id) {
  // Return single assigned AirBear
}

// Customer view: All available AirBears  
.eq("is_available", true)
```

## 🔧 Debugging Workflows

### Checkout Loading Issues
1. **Check Network Tab**: Monitor Stripe API calls
2. **Console Logs**: Look for authentication errors
3. **State Inspection**: Verify loading state changes
4. **Payment Flow**: Track payment intent creation → confirmation

### Driver Assignment Problems
1. **Database Check**: Verify `users.assigned_airbear_id` is set
2. **API Response**: Check `/api/airbear/locations` returns correct filter
3. **Role Verification**: Ensure user has `role='driver'`
4. **Dashboard Display**: Confirm AirBear status shows correctly

### Common Issues & Solutions

#### Issue: Checkout stuck on "Setting up payment..."
**Solution**: Check Stripe initialization and API keys
```typescript
// Verify environment variables
process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
process.env.STRIPE_SECRET_KEY
```

#### Issue: Driver sees all AirBears instead of just assigned one
**Solution**: Check API filtering logic
```typescript
// In /api/airbear/locations/route.ts
if (userProfile?.role === "driver" && userProfile.assigned_airbear_id) {
  // Should filter by assigned_airbear_id
}
```

#### Issue: Loading spinners not showing
**Solution**: Verify state management
```typescript
// Check useState declarations
const [loading, setLoading] = useState(false)
// Ensure setLoading(true) is called appropriately
```

## 📊 CodeMaps Integration

### VS Code Debugging
1. Install CodeMaps extension
2. Set breakpoints in checkout components
3. Use source maps for TypeScript debugging

### Chrome DevTools
1. Open DevTools → Sources
2. Navigate to `/_next/codemaps`
3. Set breakpoints in checkout flow

### Playwright Testing
1. Use CodeMaps for test debugging
2. Trace checkout flow end-to-end
3. Verify loading states in automated tests

## 🎯 Performance Monitoring

### Loading State Metrics
- **Auth Loading**: Should complete < 2 seconds
- **Payment Setup**: Stripe initialization < 3 seconds  
- **API Response**: AirBear locations < 1 second

### Error Tracking
- **Checkout Failures**: Log Stripe error codes
- **Driver Assignment**: Track missing assignments
- **API Timeouts**: Monitor response times

## 🚀 Next Steps

1. **Add Error Boundaries**: Wrap checkout components
2. **Implement Retry Logic**: For failed API calls
3. **Add Analytics**: Track checkout conversion
4. **Optimize Loading**: Add skeleton screens

## 📝 Testing Checklist

- [ ] Checkout loading states work correctly
- [ ] Driver sees only assigned AirBear
- [ ] Payment processing completes successfully
- [ ] Error handling displays user-friendly messages
- [ ] Loading spinners appear at appropriate times
- [ ] API filtering works for different user roles

---

**Last Updated**: January 4, 2026  
**Features**: Checkout loading states, Driver AirBear management  
**Debug Tools**: VS Code, Chrome DevTools, Playwright
