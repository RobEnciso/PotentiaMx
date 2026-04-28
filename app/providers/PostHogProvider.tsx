'use client';

import { Suspense, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react';

function PostHogPageView() {
  const [isMounted, setIsMounted] = useState(false);
  const posthog = usePostHog();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !pathname || !posthog) return;
    posthog.capture('$pageview', { $current_url: window.location.href });
  }, [isMounted, pathname, searchParams, posthog]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const initPostHog = () => {
      if (typeof window !== 'undefined') {
        const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

        if (!posthogKey) {
          if (process.env.NODE_ENV === 'development') {
            console.log('📊 PostHog: No API key found, analytics disabled');
          }
          return;
        }

        posthog.init(posthogKey, {
          api_host: '/ingest',
          ui_host: 'https://us.i.posthog.com',
          loaded: () => {
            if (process.env.NODE_ENV === 'development') {
              console.log('📊 PostHog initialized');
            }
          },
          capture_pageview: false,
          capture_pageleave: true,
          autocapture: false,
        });
      }
    };

    if (document.readyState === 'complete') {
      initPostHog();
    } else {
      window.addEventListener('load', initPostHog);
      return () => window.removeEventListener('load', initPostHog);
    }
  }, []);

  return (
    <PHProvider client={posthog}>
      {isClient && (
        <Suspense fallback={null}>
          <PostHogPageView />
        </Suspense>
      )}
      {children}
    </PHProvider>
  );
}
