import Stripe from "stripe";
import { z } from "zod";

const stripeEnvSchema = z.object({
  STRIPE_SECRET_KEY: z
    .string()
    .min(1, "STRIPE_SECRET_KEY is required")
    .regex(/^sk_(test_|live_)/, "Invalid Stripe secret key format"),
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
});

/**
 * Initialize Stripe lazily to avoid build-time errors when env vars are missing.
 */
function getStripe() {
  const env = stripeEnvSchema.parse({
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NODE_ENV: process.env.NODE_ENV,
  });

  return new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-01-28.clover",
    typescript: true,
  });
}

export const stripe = process.env.STRIPE_SECRET_KEY
  ? getStripe()
  : (null as any as Stripe);
