const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

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
  generateBuildId: async () => {
    return "build-id";
  },
  env: {
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
  },
  // Added redirects for SEO improvements
  async redirects() {
    return [
      // Redirect old URL patterns
      {
        source: '/dialysis-center/:slug',
        destination: '/:slug',
        permanent: true,
      },
      {
        source: '/undefined/:slug',
        destination: '/:slug',
        permanent: true,
      },
      // Handle possible case variations (improve user experience)
      {
        source: '/Dialysis-Center/:slug',
        destination: '/:slug',
        permanent: true,
      },
      {
        source: '/DIALYSIS-CENTER/:slug',
        destination: '/:slug',
        permanent: true,
      },
      // Normalize trailing slashes
      {
        source: '/:path*/',
        destination: '/:path*',
        permanent: true,
      },
      // Redirect old paths if they existed in your app
      {
        source: '/centers',
        destination: '/peta',
        permanent: true,
      },
      {
        source: '/about',
        destination: '/tentang-kami',
        permanent: true,
      },
      {
        source: '/contact',
        destination: '/hubungi-kami',
        permanent: true,
      },
      {
        source: '/terms',
        destination: '/terma-dan-syarat',
        permanent: true,
      },
      {
        source: '/privacy',
        destination: '/polisi-privasi',
        permanent: true,
      },
    ];
  },
  // Added rewrites for cleaner URLs (if needed)
  async rewrites() {
    return {
      beforeFiles: [
        // Handle dynamic sitemap generation
        {
          source: '/sitemap-centers-:num.xml',
          destination: '/api/sitemap/:num',
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  // Enhanced headers for security and caching
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
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        // Cache static assets
        source: '/(fonts|images|icons)/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache-control for static pages
        source: '/(tentang-kami|terma-dan-syarat|polisi-privasi)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
};

module.exports = withContentlayer(withPWA(nextConfig));
