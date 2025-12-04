import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // PERFORMANCE CRITICAL: Aggressive optimization settings
  reactStrictMode: true,

  // Reduce bundle size by removing unused code
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Experimental optimizations for better performance
  experimental: {
    // Optimize package imports (tree shaking)
    optimizePackageImports: ['lucide-react', '@supabase/ssr', 'posthog-js'],
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tuhojmupstisctgaepsc.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
    // Optimize image loading
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Headers for better caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
