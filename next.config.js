const { withContentlayer } = require("next-contentlayer");
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Add this section
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      // Don't bundle certain packages on the client in production
      config.resolve.alias = {
        ...config.resolve.alias,
        "mapbox-gl": false,
        "@prisma/client": false,
        contentlayer: false,
      };
    }
    return config;
  },
};

module.exports = withContentlayer(nextConfig);
