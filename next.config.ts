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
    // ⚡ MOBILE PERFORMANCE: Optimize image loading for mobile devices
    formats: ['image/avif', 'image/webp'],
    // Mobile-first device sizes (prioritize smaller sizes for faster load)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // Lazy load images by default (except priority images)
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Headers for better caching
  async headers() {
    return [
      // ⚡ CRITICAL PERFORMANCE: Exclude root path to prevent TTFB blocking
      // Apply security headers to all routes EXCEPT landing page
      {
        source: '/((?!^$).*)', // Matches all paths except root "/"
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
