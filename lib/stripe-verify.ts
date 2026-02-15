import crypto from "crypto";

/** Hardened Stripe verification (replay-protected, timing-safe) */
export function verifyStripe(sig: string, body: string, secret: string): boolean {
  try {
    const pairs = Object.fromEntries(sig.split(",").map(p => p.split("=")));
    const t = pairs["t"], v1 = pairs["v1"];
    if (!t || !v1) return false;

    // 5-minute replay protection
    if (Math.abs(Math.floor(Date.now() / 1000) - parseInt(t)) > 300) return false;

    const expected = crypto.createHmac("sha256", secret).update(`${t}.${body}`).digest("hex");
    const sigB = Buffer.from(v1, "hex"), expB = Buffer.from(expected, "hex");

    return sigB.length === expB.length && crypto.timingSafeEqual(sigB, expB);
  } catch {
    return false; // Fail securely
  }
}
