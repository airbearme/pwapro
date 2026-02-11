import crypto from "crypto";

/**
 * Hardened Stripe Webhook Verification
 * Implements:
 * - Signature parsing (t=, v1=)
 * - 5-minute replay protection (timestamp validation)
 * - Timing-safe comparison to prevent side-channel attacks
 */
export function verifyStripe(sig: string, body: string, secret: string): boolean {
  try {
    if (!sig || !body || !secret) return false;

    const parts = sig.split(",");
    const tPart = parts.find((p) => p.startsWith("t="));
    const v1Part = parts.find((p) => p.startsWith("v1="));

    if (!tPart || !v1Part) return false;

    const t = tPart.split("=")[1];
    const v1 = v1Part.split("=")[1];

    // Replay protection: Reject if timestamp is older than 5 minutes
    const now = Math.floor(Date.now() / 1000);
    const timestamp = parseInt(t, 10);

    if (isNaN(timestamp) || Math.abs(now - timestamp) > 300) {
      return false;
    }

    // Verify signature
    const signedPayload = `${t}.${body}`;
    const expectedSig = crypto
      .createHmac("sha256", secret)
      .update(signedPayload)
      .digest("hex");

    const v1Buffer = Buffer.from(v1);
    const expectedSigBuffer = Buffer.from(expectedSig);

    if (v1Buffer.length !== expectedSigBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(v1Buffer, expectedSigBuffer);
  } catch (error) {
    return false;
  }
}
