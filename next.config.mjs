/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["tsx", "ts", "jsx", "js"],
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  async headers() {
    return [
      {
        source: '/(.*)',
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
            key: 'Content-Security-Policy',
            // CSP is intentionally permissive to avoid breaking changes.
            // A stricter policy should be implemented as a follow-up task.
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';",
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          // The 'Strict-Transport-Security' header should be enabled only in a production
          // environment where the application is served over HTTPS.
          // {
          //   key: 'Strict-Transport-Security',
          //   value: 'max-age=63072000; includeSubDomains; preload',
          // },
        ],
      },
    ];
  },
};

export default nextConfig;
