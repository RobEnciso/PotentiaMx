'use client';

import Image from 'next/image';

interface PotentiaSkeletonProps {
  count?: number;
  variant?: 'card' | 'hero' | 'list';
}

/**
 * PotentiaSkeleton - Elegant loading skeleton with PotentiaMX branding
 *
 * Uses the white logo SVG with CSS filters to create a subtle gray watermark
 * Perfect for maintaining brand presence during loading states
 */
export default function PotentiaSkeleton({
  count = 3,
  variant = 'card'
}: PotentiaSkeletonProps) {

  // Card variant - for property cards grid
  if (variant === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto px-6">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-sm border border-gray-200"
          >
            {/* Animated pulse background */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />

            {/* Card content */}
            <div className="relative p-8">
              {/* Logo watermark - subtle gray with pulse */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-32 h-32 animate-pulse">
                  <Image
                    src="/logo-white.svg"
                    alt="Loading..."
                    fill
                    className="object-contain brightness-0 opacity-[0.08] select-none pointer-events-none"
                    priority
                  />
                </div>
              </div>

              {/* Skeleton content lines */}
              <div className="space-y-4">
                <div className="h-6 bg-gray-200/80 rounded-lg w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200/60 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200/60 rounded w-5/6 animate-pulse" />
                <div className="h-10 bg-gray-200/80 rounded-lg w-1/2 mt-6 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Hero variant - for full-screen loading
  if (variant === 'hero') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          {/* Large logo with pulse animation */}
          <div className="relative w-48 h-48 mx-auto mb-8 animate-pulse">
            <Image
              src="/logo-white.svg"
              alt="Cargando PotentiaMX..."
              fill
              className="object-contain opacity-20 select-none pointer-events-none"
              priority
            />
          </div>

          {/* Loading text */}
          <div className="space-y-3">
            <div className="h-8 bg-white/10 rounded-lg w-64 mx-auto animate-pulse" />
            <div className="h-4 bg-white/5 rounded w-48 mx-auto animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // List variant - for list items
  if (variant === 'list') {
    return (
      <div className="space-y-4 w-full max-w-4xl mx-auto px-6">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
          >
            {/* Small logo icon */}
            <div className="relative w-12 h-12 flex-shrink-0 animate-pulse">
              <Image
                src="/logo-white.svg"
                alt="Loading..."
                fill
                className="object-contain brightness-0 opacity-[0.08] select-none pointer-events-none"
                priority
              />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200/80 rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-gray-200/60 rounded w-1/2 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

// Add shimmer animation to globals.css
// @keyframes shimmer {
//   0% { transform: translateX(-100%); }
//   100% { transform: translateX(100%); }
// }
// .animate-shimmer {
//   animation: shimmer 2s infinite;
// }
