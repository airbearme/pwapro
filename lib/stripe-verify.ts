import crypto from "crypto";

/**
 * Verify Stripe webhook signature using timing-safe comparison.
 * Note: In production, it is recommended to use stripe.webhooks.constructEvent.
 */
export function verifyStripe(sig: string, body: string, secret: string): boolean {
  // Create HMAC hex digest
  const h = crypto.createHmac("sha256", secret).update(body).digest("hex");

  // Stripe signatures in the header are typically in format: t=TIMESTAMP,v1=SIGNATURE
  const signature = sig.split(',').find(p => p.trim().startsWith('v1='))?.trim().substring(3);

  // If we can't find v1=, fallback to full string if it looks like a hex digest
  const target = signature || sig;

  // Use timingSafeEqual to prevent timing attacks.
  // Both must be buffers of the same length.
  try {
    const signatureBuffer = Buffer.from(target, 'hex');
    const hashBuffer = Buffer.from(h, 'hex');

    if (signatureBuffer.length !== hashBuffer.length || signatureBuffer.length === 0) {
      return false;
    }

    return crypto.timingSafeEqual(signatureBuffer, hashBuffer);
  } catch (e) {
    return false;
  }
}
