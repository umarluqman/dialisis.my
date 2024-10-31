const { withContentlayer } = require("next-contentlayer");

/** @type {import('next').NextConfig} */
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
  // Required for AWS Amplify
  generateBuildId: async () => {
    return "build-id";
  },
};

module.exports = withContentlayer(nextConfig);
