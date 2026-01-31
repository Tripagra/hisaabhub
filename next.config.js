/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['hpaguyquajofazmuytwd.supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Custom webpack config
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    // Suppress known benign warnings from Supabase in Edge Runtime
    config.ignoreWarnings = [
      { module: /node_modules\/@supabase\/realtime-js/ },
      { module: /node_modules\/@supabase\/supabase-js/ },
    ];

    return config;
  },
  // Security improvements
  poweredByHeader: false,
  compress: true,
  // Explicitly disable custom PostCSS config if needed
  experimental: {
    forceSwcTransforms: true,
  },
};

module.exports = nextConfig;