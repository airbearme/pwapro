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
          // Content-Security-Policy: Mitigates XSS attacks by restricting resource loading.
          // NOTE: 'unsafe-inline' and 'unsafe-eval' are used as a pragmatic starting point,
          // but this is technical debt that should be addressed by refactoring inline scripts/styles.
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
          }
        ],
      },
    ];
  },
};

export default nextConfig;
