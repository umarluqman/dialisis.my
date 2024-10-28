const { withContentlayer } = require("next-contentlayer");
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    mdxRs: true,
  },
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
};

module.exports = withContentlayer(nextConfig);
