export const SECURITY_HEADERS = {
  /**
   * Content Security Policy (CSP)
   *
   * NOTE: 'unsafe-inline' and 'unsafe-eval' are currently required by existing
   * third-party integrations and legacy components.
   *
   * Technical Debt: Plan to move to nonces/hashes and eliminate 'unsafe-eval'
   * as part of future security hardening.
   */
  "Content-Security-Policy": 
    "default-src 'self' 'unsafe-inline' 'unsafe-eval'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://fonts.googleapis.com; connect-src 'self' https://vercel.live https://api.stripe.com https://js.stripe.com https://fofmrqgcidfenbevayrg.supabase.co wss://fofmrqgcidfenbevayrg.supabase.co; frame-src 'self' https://js.stripe.com; object-src 'none'; frame-ancestors 'none'; upgrade-insecure-requests; base-uri 'self'; form-action 'self'",
  "Referrer-Policy": "origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload"
};
