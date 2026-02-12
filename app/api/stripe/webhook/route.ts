import { NextResponse } from "next/server";
import { verifyStripe } from "@/lib/stripe-verify";

/**
 * Stripe Webhook Route
 * Hardened with signature verification and replay protection
 */
export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature) {
      console.error("Missing Stripe signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    if (!secret) {
      console.error("Missing STRIPE_WEBHOOK_SECRET environment variable");
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    const isValid = verifyStripe(signature, body, secret);

    if (!isValid) {
      console.warn("Invalid Stripe signature detected");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Process the verified webhook event
    const event = JSON.parse(body);

    // Log successful verification (without PII)
    console.log(`Verified Stripe event: ${event.type} (${event.id})`);

    // Handle the event types here
    // For example: checkout.session.completed, payment_intent.succeeded, etc.

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err instanceof Error ? err.message : "Unknown error");
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
