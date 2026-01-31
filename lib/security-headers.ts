export const SECURITY_HEADERS = {
  "Content-Security-Policy":
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://vercel.live https://va.vercel-scripts.com https://www.googletagmanager.com https://www.google-analytics.com; " +
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://*.tile.openstreetmap.org https://vitals.vercel-insights.com https://*.cartocdn.com; " +
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com; " +
    "img-src 'self' blob: data: https://*.tile.openstreetmap.org https://*.supabase.co https://*.stripe.com https://unpkg.com https://*.cartocdn.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com; " +
    "font-src 'self' data: https://fonts.gstatic.com https://fonts.googleapis.com; " +
    "object-src 'none'; " +
    "frame-ancestors 'none'; " +
    "upgrade-insecure-requests; " +
    "base-uri 'self'; " +
    "form-action 'self';",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(self), browsing-topics=()",
  "Referrer-Policy": "origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload"
};
