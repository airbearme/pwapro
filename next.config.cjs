/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Enable source maps for CodeMaps
  productionBrowserSourceMaps: true,

  // Configure source maps
  webpack: (config, { dev, isServer }) => {
    // Enable source maps in production
    if (!dev && !isServer) {
      config.devtool = "source-map";

      // Ensure source maps are generated
      config.optimization = {
        ...config.optimization,
        minimizer: config.optimization.minimizer.map((minimizer) => {
          if (minimizer.constructor.name === "TerserPlugin") {
            minimizer.options.sourceMap = true;
          }
          return minimizer;
        }),
      };
    }

    // Custom source map configuration
    config.output = {
      ...config.output,
      sourceMapFilename: "../static/chunks/[name].map",
      devtoolModuleFilenameTemplate: "[absolute-resource-path]",
    };

    return config;
  },

  // Experimental features for better source mapping
  experimental: {
    serverComponentsExternalPackages: ["@supabase/supabase-js"],
    sourceMaps: true,
    optimizeCss: true,
  },

  // Configure static files
  generateEtags: false,

  // Headers for source maps
  async headers() {
    return [
      {
        source: "/_next/static/chunks/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/codemaps/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Content-Type",
            value: "application/json",
          },
        ],
      },
    ];
  },

  // Redirects for CodeMaps
  async redirects() {
    return [
      {
        source: "/codemaps",
        destination: "/_next/codemaps/index.json",
        permanent: false,
      },
    ];
  },

  // Environment variables for CodeMaps
  env: {
    NEXT_SOURCEMAPS: process.env.NODE_ENV === "production" ? "true" : "false",
    GENERATE_SOURCEMAP:
      process.env.NODE_ENV === "production" ? "true" : "false",
  },
};

module.exports = nextConfig;
