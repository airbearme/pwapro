import Stripe from "stripe";

import { env } from "@/lib/env";

/**
 * Stripe Server Client
 *
 * This client is used for server-side Stripe operations like creating payment intents,
 * handling webhooks, and managing customers.
 *
 * NOTE: We use a type cast to any for apiVersion because the Stripe SDK types
 * sometimes lag behind the actual API versions available in the dashboard,
 * or the project uses a specific version that doesn't match the installed types.
 */
export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-12-15.clover" as any,
  typescript: true,
});
