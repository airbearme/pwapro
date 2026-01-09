/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["tsx", "ts", "jsx", "js"],
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            // TODO: A stricter CSP is needed. The current policy includes 'unsafe-inline' and 'unsafe-eval'
            // which are insecure. This should be replaced with a nonce-based or hash-based approach.
            value: "default-src 'self' 'unsafe-inline' 'unsafe-eval'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://fonts.googleapis.com; connect-src 'self' https://vercel.live https://api.stripe.com https://js.stripe.com https://fofmrqgcidfenbevayrg.supabase.co wss://fofmrqgcidfenbevayrg.supabase.co; frame-src 'self' https://js.stripe.com; object-src 'none'; frame-ancestors 'none'; upgrade-insecure-requests; base-uri 'self'; form-action 'self'".replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ]
  },
};

export default nextConfig;
