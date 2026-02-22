import { loadStripe, type Stripe } from "@stripe/stripe-js"

let stripePromise: Promise<Stripe | null> | null = null

export const getStripe = () => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

  if (!publishableKey) {
    console.error("❌ Stripe configuration error: Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY")
    throw new Error(
      "Missing Stripe publishable key. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    )
  }

  // Validate key format
  if (!publishableKey.startsWith("pk_")) {
    throw new Error(
      `Invalid Stripe publishable key format. Expected key starting with 'pk_', got: ${publishableKey.substring(0, 10)}...`,
    )
  }

  // Warn if using test key in production
  if (publishableKey.startsWith("pk_test_") && process.env.NODE_ENV === "production") {
    console.warn("⚠️ Using Stripe test key in production environment")
  }

  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey)
      .then((stripe) => {
        if (!stripe) {
          console.error("❌ Failed to load Stripe")
        }
        return stripe
      })
      .catch((error) => {
        console.error("❌ Error loading Stripe:", error)
        throw error
      })
  }

  return stripePromise
}
