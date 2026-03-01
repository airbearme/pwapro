import crypto from "crypto";

/**
 * Verifies a Stripe webhook signature using timing-safe comparison
 * and replay protection (5-minute window).
 *
 * @param sig - The Stripe-Signature header value (e.g., "t=123,v1=abc")
 * @param body - The raw request body string
 * @param secret - The Stripe Webhook Secret (whsec_...)
 * @returns boolean - True if verification succeeds
 */
export function verifyStripe(sig: string, body: string, secret: string): boolean {
  if (!sig || !body || !secret) return false;

  // 1. Parse signature header
  const parts = sig.split(",");
  const t = parts.find((p) => p.startsWith("t="))?.split("=")[1];
  const v1 = parts.find((p) => p.startsWith("v1="))?.split("=")[1];

  if (!t || !v1) return false;

  // 2. Replay protection (5-minute window)
  const timestamp = parseInt(t, 10);
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > 300) {
    console.error("[Sentinel] Stripe webhook replay attempt detected or clock skew too large");
    return false;
  }

  // 3. Reconstruct payload: {timestamp}.{body}
  const payload = `${t}.${body}`;

  // 4. Calculate HMAC-SHA256
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  // 5. Timing-safe comparison to prevent side-channel attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(v1),
      Buffer.from(hmac)
    );
  } catch (err) {
    // If lengths differ, timingSafeEqual throws - this is a failure
    return false;
  }
}
