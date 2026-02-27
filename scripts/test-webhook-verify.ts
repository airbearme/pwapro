import crypto from "crypto";
import { verifyStripe } from "../lib/stripe-verify";

const secret = "whsec_test_secret";
const body = JSON.stringify({ id: "evt_test", type: "checkout.session.completed" });
const timestamp = Math.floor(Date.now() / 1000).toString();

function test() {
  console.log("🧪 Testing verifyStripe...");

  const signedPayload = `${timestamp}.${body}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(signedPayload)
    .digest("hex");

  const sig = `t=${timestamp},v1=${signature}`;

  const result = verifyStripe(sig, body, secret);
  if (result === true) {
    console.log("✅ Valid signature test passed");
  } else {
    console.error("❌ Valid signature test failed");
    process.exit(1);
  }

  const invalidSig = `t=${timestamp},v1=invalid_signature`;
  if (verifyStripe(invalidSig, body, secret) === false) {
    console.log("✅ Invalid signature test passed");
  } else {
    console.error("❌ Invalid signature test failed");
    process.exit(1);
  }

  if (verifyStripe(sig, body, "wrong_secret") === false) {
    console.log("✅ Wrong secret test passed");
  } else {
    console.error("❌ Wrong secret test failed");
    process.exit(1);
  }

  console.log("🎉 All tests passed!");
}

test();
