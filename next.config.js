const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net",
      "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
      "upgrade-insecure-requests",
    ].join("; "),
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer({
  output: 'standalone',
  poweredByHeader: false,
  experimental: {
    serverComponentsExternalPackages: [
      "@libsql/client",
      "@prisma/adapter-libsql",
      "mapbox-gl",
    ],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 's3.ap-southeast-1.amazonaws.com' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
    ],
  },
  webpack: (config, { dev, isServer }) => {
    if (config.cache && !dev) {
      config.cache = { type: "memory" };
    }
    if (isServer) {
      config.externals = [...(config.externals || []), 'mapbox-gl'];
    }
    return config;
  },
  generateBuildId: async () => {
    return "build-id";
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.dialisis.my',
          },
        ],
        destination: 'https://dialisis.my/:path*',
        permanent: true,
      },
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
      {
        source: '/((?!api|_next).+)/$',
        destination: '/$1',
        permanent: true,
      },
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
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/sitemap-centers-:num.xml',
          destination: '/api/sitemap/:num',
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          ...securityHeaders,
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
        source: '/(fonts|images|icons)/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(tentang-kami|terma-dan-syarat|polisi-privasi)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
});

module.exports = nextConfig;
