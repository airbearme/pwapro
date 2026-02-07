## 2026-02-07 - Webhook Replay Attacks and Middleware Header Gaps

**Vulnerability:** Stripe webhook verification was using loose string comparison (`includes`) instead of timing-safe comparison, and was missing timestamp validation to prevent replay attacks. Additionally, security headers were bypassed on redirects in the Next.js middleware.

**Learning:** Next.js `NextResponse.redirect()` returns a new response object, so any headers applied to a previous `NextResponse.next()` object are lost. Headers must be applied to the final response being returned, regardless of its type. For webhooks, timing-safe comparison is necessary but insufficient; timestamp validation (replay protection) is also critical.

**Prevention:** Use a helper function in middleware to wrap all returned responses (next, redirect, rewrite) with required security headers. For webhooks, leverage official libraries (like `stripe.webhooks.constructEvent`) which handle both timing-safe comparison and replay protection out of the box.
