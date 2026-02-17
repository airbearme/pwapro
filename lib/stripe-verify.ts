import crypto from "crypto";

/**
 * Hardened Stripe webhook signature verification
 */
export function verifyStripe(sig: string, body: string, secret: string): boolean {
  try {
    const p = Object.fromEntries(sig.split(",").map((s) => s.split("=")));
    const t = parseInt(p.t, 10), v1 = p.v1;
    if (!v1 || isNaN(t) || Math.abs(Date.now() / 1000 - t) > 300) return false;
    const h = crypto.createHmac("sha256", secret).update(`${t}.${body}`).digest("hex");
    return v1.length === h.length && crypto.timingSafeEqual(Buffer.from(v1), Buffer.from(h));
  } catch {
    return false;
  }
}
