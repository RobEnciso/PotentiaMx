import Image from 'next/image';

/**
 * Global Loading Screen - Next.js App Router
 *
 * This component is automatically displayed during page transitions
 * providing a native app-like experience (similar to Airbnb)
 *
 * Features:
 * - Full-screen overlay prevents flash of unstyled content
 * - Branded loading with PotentiaMX logo
 * - Smooth fade-in/fade-out transitions
 * - Prevents layout shift during navigation
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      {/* Loading Container */}
      <div className="flex flex-col items-center justify-center gap-6">
        {/* Animated Logo - Main loading indicator */}
        <div className="relative w-32 h-32 animate-pulse">
          <Image
            src="/logo-white.svg"
            alt="Cargando PotentiaMX..."
            fill
            className="object-contain brightness-0 opacity-20 select-none pointer-events-none"
            priority
          />
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium text-gray-600 animate-pulse">
            Cargando...
          </p>

          {/* Animated Progress Dots */}
          <div className="flex gap-1.5">
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
