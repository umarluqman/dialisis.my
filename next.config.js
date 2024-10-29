const { withContentlayer } = require("next-contentlayer");
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  mdxRs: true,
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
};

module.exports = withContentlayer(nextConfig);
