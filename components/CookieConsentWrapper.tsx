'use client';

import dynamic from 'next/dynamic';

// ⚡ MOBILE PERFORMANCE: Lazy load CookieConsent to prevent blocking initial render
// This wrapper is a Client Component that can use dynamic() with ssr: false
// Banner appears after user interaction, not blocking critical path
const CookieConsent = dynamic(() => import('@/components/CookieConsent'), {
  ssr: false, // Client-side only (uses localStorage)
  loading: () => null, // No loading state needed
});

export default function CookieConsentWrapper() {
  return <CookieConsent />;
}
