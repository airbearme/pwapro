import crypto from "crypto";

/**
 * Verifies a Stripe webhook signature using timing-safe comparison and timestamp validation.
 *
 * @param sig - The Stripe signature header (t=...,v1=...)
 * @param body - The raw request body as a string
 * @param secret - The Stripe webhook signing secret (whsec_...)
 * @returns boolean - True if the signature is valid and within the tolerance window
 */
export function verifyStripe(
  sig: string,
  body: string,
  secret: string,
): boolean {
  try {
    if (!sig || !body || !secret) return false;

    // Parse Stripe signature header
    const pairs = sig.split(",");
    const tPair = pairs.find((p) => p.trim().startsWith("t="));
    const v1Pair = pairs.find((p) => p.trim().startsWith("v1="));

    if (!tPair || !v1Pair) return false;

    const t = tPair.split("=")[1];
    const v1 = v1Pair.split("=")[1];

    if (!t || !v1) return false;

    // Replay protection: check if timestamp is within 5 minutes (300 seconds)
    const tolerance = 300;
    const timestamp = parseInt(t, 10);
    const now = Math.floor(Date.now() / 1000);

    if (isNaN(timestamp) || Math.abs(now - timestamp) > tolerance) {
      return false;
    }

    // Compute expected signature: hmac_sha256(secret, timestamp + "." + body)
    const signedPayload = `${t}.${body}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(signedPayload)
      .digest("hex");

    // Timing-safe comparison to prevent timing attacks
    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const v1Buffer = Buffer.from(v1, "hex");

    if (expectedBuffer.length !== v1Buffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, v1Buffer);
  } catch (error) {
    console.error("Stripe verification error:", error);
    return false;
  }
}
