import crypto from "crypto";

/**
 * Hardened Stripe webhook verification
 * - Full signature parsing (t=, v1=)
 * - 5-minute replay protection window
 * - Timing-safe comparison to prevent timing attacks
 */
export function verifyStripe(
  sigHeader: string,
  body: string,
  secret: string,
): boolean {
  if (!sigHeader || !body || !secret) return false;

  // 1. Parse signature header
  const parts = sigHeader.split(",").reduce(
    (acc, part) => {
      const [key, value] = part.split("=");
      if (key && value) acc[key.trim()] = value.trim();
      return acc;
    },
    {} as Record<string, string>,
  );

  const timestamp = parts["t"];
  const signature = parts["v1"];

  if (!timestamp || !signature) return false;

  // 2. Replay protection: check if timestamp is within 5 minutes (300 seconds)
  const now = Math.floor(Date.now() / 1000);
  const ts = parseInt(timestamp, 10);
  if (isNaN(ts) || Math.abs(now - ts) > 300) {
    return false;
  }

  // 3. Verify signature
  const signedPayload = `${timestamp}.${body}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(signedPayload)
    .digest("hex");

  const expectedBuffer = Buffer.from(expectedSignature);
  const signatureBuffer = Buffer.from(signature);

  // Use timing-safe comparison
  if (expectedBuffer.length !== signatureBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
}
