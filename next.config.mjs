const isDev = process.env.NODE_ENV === 'development';

// Define the Content-Security-Policy
// ⚠️ ATTENTION: 'unsafe-inline' is used for script-src and style-src.
// This is a temporary measure to avoid breaking the application, as it currently
// relies on inline scripts/styles. A follow-up task should be created to
// refactor these to use external files or hashes/nonces to enable a stricter CSP.
const vercelLive = isDev ? 'https://vercel.live' : '';
const csp = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://vitals.vercel-insights.com ${vercelLive};
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  font-src 'self';
  connect-src 'self' https://*.supabase.co https://vitals.vercel-insights.com;
  frame-src https://js.stripe.com;
`.trim().replace(/\s{2,}/g, ' ');

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
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains',
          },
          {
            key: 'Content-Security-Policy',
            value: csp,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
