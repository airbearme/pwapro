import Stripe from "stripe"
import { z } from "zod"

const stripeEnvSchema = z.object({
  STRIPE_SECRET_KEY: z.string()
    .min(1, "STRIPE_SECRET_KEY is required")
    .regex(/^sk_(test_|live_)/, "Invalid Stripe secret key format"),
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
})

const env = stripeEnvSchema.parse({
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  NODE_ENV: process.env.NODE_ENV,
})

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  // ⚡ Bolt: Use type assertion to bypass environment-specific API version type mismatches
  apiVersion: "2025-12-15.clover" as any,
  typescript: true,
})