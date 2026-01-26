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
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          // 🛡️ SENTINEL-NOTE: The current CSP is overly permissive and uses 'unsafe-inline' and 'unsafe-eval'.
          // This is a temporary measure to avoid breaking the application and should be considered technical debt.
          // A stricter policy using nonces or hashes should be implemented in the future to properly mitigate XSS risks.
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://assets.vercel.com; style-src 'self' 'unsafe-inline'; connect-src 'self' *.supabase.co wss://*.supabase.co vitals.vercel-insights.com; img-src 'self' data: *.supabase.co; frame-src 'self' *.stripe.com; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';",
          }
        ],
      },
    ];
  },
};

export default nextConfig;
