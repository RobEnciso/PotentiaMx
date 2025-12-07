'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track pageviews on route change
    if (pathname && posthog.__loaded) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture('$pageview', {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // ⚡ MOBILE PERFORMANCE OPTIMIZATION: Init PostHog after window.load
    // This ensures analytics never block critical rendering, especially on slow mobile networks
    // Desktop: ~1-2s delay, Mobile 3G: ~5-8s delay (but page is already interactive)
    const initPostHog = () => {
      if (typeof window !== 'undefined') {
        const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

        // Skip initialization if no key or in development without key
        if (!posthogKey) {
          if (process.env.NODE_ENV === 'development') {
            console.log('📊 PostHog: No API key found, analytics disabled');
          }
          return;
        }

        posthog.init(posthogKey, {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
          loaded: (posthog) => {
            if (process.env.NODE_ENV === 'development') {
              console.log('📊 PostHog initialized after window.load (mobile-optimized)');
            }
          },
          capture_pageview: false, // Manual pageview tracking
          capture_pageleave: true, // Track when users leave
          autocapture: false, // Manual event tracking only
        });
      }
    };

    // Wait for full page load (all resources including images)
    if (document.readyState === 'complete') {
      // Already loaded, init immediately
      initPostHog();
    } else {
      // Wait for window.load event
      window.addEventListener('load', initPostHog);
      return () => window.removeEventListener('load', initPostHog);
    }
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </>
  );
}
