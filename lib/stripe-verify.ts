import crypto from "crypto";

/**
 * 🛡️ Sentinel: Hardened Stripe webhook verification.
 * Uses timing-safe comparison to prevent side-channel attacks.
 * Note: sig is expected to be the full signature string from Stripe (including timestamp).
 * For production, use stripe.webhooks.constructEvent() which handles this automatically.
 */
export function verifyStripe(sig: string, body: string, secret: string): boolean {
  if (!sig || !body || !secret) return false;

  try {
    // Basic HMAC verification using timing-safe comparison
    // Format: t=TIMESTAMP,v1=SIGNATURE
    const parts = sig.split(",");
    const v1Part = parts.find((p) => p.startsWith("v1="));
    const tPart = parts.find((p) => p.startsWith("t="));

    if (!v1Part || !tPart) return false;

    const signature = v1Part.substring(3);
    const timestamp = tPart.substring(2);

    // Payload is timestamp.body as per Stripe documentation
    const signedPayload = `${timestamp}.${body}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(signedPayload)
      .digest("hex");

    // Timing-safe comparison to prevent timing attacks
    const signatureBuffer = Buffer.from(signature, "hex");
    const expectedSignatureBuffer = Buffer.from(expectedSignature, "hex");

    if (signatureBuffer.length !== expectedSignatureBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(signatureBuffer, expectedSignatureBuffer);
  } catch (error) {
    console.error("🛡️ Sentinel: Webhook verification failed", error);
    return false;
  }
}
