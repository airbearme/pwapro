import crypto from "crypto";

/**
 * Hardened Stripe Webhook Verification
 * Includes 5-min replay protection and timing-safe comparison.
 */
export function verifyStripe(sig: string, body: string, secret: string): boolean {
  try {
    const pairs = Object.fromEntries(sig.split(',').map(p => p.split('=').map(s => s.trim())));
    const { t, v1 } = pairs;
    if (!t || !v1 || Math.abs(Math.floor(Date.now() / 1000) - parseInt(t)) > 300) return false;

    const h = crypto.createHmac("sha256", secret).update(`${t}.${body}`).digest("hex");
    return v1.length === h.length && crypto.timingSafeEqual(Buffer.from(v1, "hex"), Buffer.from(h, "hex"));
  } catch {
    return false;
  }
}
