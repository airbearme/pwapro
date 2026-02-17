import crypto from "crypto";

/**
 * Hardened Stripe webhook signature verification
 * - Parses t= and v1= from signature string
 * - Implements 5-minute (300s) replay protection
 * - Uses timing-safe comparison to prevent timing attacks
 */
export function verifyStripe(sig: string, body: string, secret: string): boolean {
  try {
    // 1. Parse signature
    const pairs = sig.split(",").map((pair) => pair.split("="));
    const t = pairs.find((p) => p[0] === "t")?.[1];
    const v1 = pairs.find((p) => p[0] === "v1")?.[1];

    if (!t || !v1) {
      return false;
    }

    // 2. Replay protection (5-minute window)
    const timestamp = parseInt(t, 10);
    const now = Math.floor(Date.now() / 1000);

    if (isNaN(timestamp) || Math.abs(now - timestamp) > 300) {
      return false;
    }

    // 3. Verify signature
    const signedPayload = `${t}.${body}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(signedPayload)
      .digest("hex");

    const v1Buffer = Buffer.from(v1);
    const expectedBuffer = Buffer.from(expectedSignature);

    // Timing-safe comparison (ensure buffer lengths match)
    if (v1Buffer.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(v1Buffer, expectedBuffer);
  } catch {
    return false;
  }
}
