import crypto from "crypto";

/**
 * Verify Stripe webhook signature using timing-safe comparison.
 * Note: In production, it is recommended to use stripe.webhooks.constructEvent.
 */
export function verifyStripe(sig: string, body: string, secret: string): boolean {
  const h = crypto.createHmac("sha256", secret).update(body).digest("hex");

  // Use timingSafeEqual to prevent timing attacks.
  // Both strings must be converted to buffers of the same length for timingSafeEqual.
  const signatureBuffer = Buffer.from(sig);
  const hashBuffer = Buffer.from(h);

  if (signatureBuffer.length !== hashBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(signatureBuffer, hashBuffer);
}
