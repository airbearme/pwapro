import { verifyStripe } from "./stripe-verify";
import crypto from "crypto";

describe("verifyStripe", () => {
  const secret = "whsec_test_secret";
  const body = JSON.stringify({
    id: "evt_123",
    type: "payment_intent.succeeded",
  });

  const generateSignature = (
    payload: string,
    secret: string,
    timestamp: number,
  ) => {
    const signedPayload = `${timestamp}.${payload}`;
    const hmac = crypto
      .createHmac("sha256", secret)
      .update(signedPayload)
      .digest("hex");
    return `t=${timestamp},v1=${hmac}`;
  };

  test("should verify a valid signature within the 5-minute window", () => {
    const now = Math.floor(Date.now() / 1000);
    const sig = generateSignature(body, secret, now);
    expect(verifyStripe(sig, body, secret)).toBe(true);
  });

  test("should reject an expired signature (older than 5 minutes)", () => {
    const sixMinutesAgo = Math.floor(Date.now() / 1000) - 360;
    const sig = generateSignature(body, secret, sixMinutesAgo);
    expect(verifyStripe(sig, body, secret)).toBe(false);
  });

  test("should reject a signature from the future (more than 5 minutes)", () => {
    const sixMinutesFuture = Math.floor(Date.now() / 1000) + 360;
    const sig = generateSignature(body, secret, sixMinutesFuture);
    expect(verifyStripe(sig, body, secret)).toBe(false);
  });

  test("should reject an invalid signature", () => {
    const now = Math.floor(Date.now() / 1000);
    const sig = `t=${now},v1=invalid_hmac`;
    expect(verifyStripe(sig, body, secret)).toBe(false);
  });

  test("should reject a signature with incorrect secret", () => {
    const now = Math.floor(Date.now() / 1000);
    const sig = generateSignature(body, "wrong_secret", now);
    expect(verifyStripe(sig, body, secret)).toBe(false);
  });

  test("should reject a signature with modified body", () => {
    const now = Math.floor(Date.now() / 1000);
    const sig = generateSignature(body, secret, now);
    expect(verifyStripe(sig, body + " tampered", secret)).toBe(false);
  });

  test("should handle malformed signature headers gracefully", () => {
    expect(verifyStripe("invalid", body, secret)).toBe(false);
    expect(verifyStripe("t=123", body, secret)).toBe(false);
    expect(verifyStripe("v1=abc", body, secret)).toBe(false);
  });

  test("should handle missing inputs gracefully", () => {
    expect(verifyStripe("", body, secret)).toBe(false);
    expect(verifyStripe(null as any, body, secret)).toBe(false);
  });
});
