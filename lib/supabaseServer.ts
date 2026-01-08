/**
 * Supabase Server-Side Client with Connection Pooling (Supavisor)
 *
 * This module provides an intelligent client selector that:
 * 1. Uses Supabase Connection Pooler (Supavisor) when available for better performance
 * 2. Falls back to standard URL if pooler is not configured
 * 3. Keeps database connections warm to prevent cold starts
 * 4. Optimized for serverless environments (Netlify Functions)
 *
 * CRITICAL: This is ONLY for server-side code (API Routes, Server Components, Middleware)
 * For client components, use lib/supabaseClient.js
 */

import { createClient } from '@supabase/supabase-js';

/**
 * Validates environment variables for server-side Supabase client
 *
 * @returns Object with validated URL and key
 * @throws Error if required environment variables are missing
 */
function validateServerEnv(): {
  url: string;
  key: string;
  isPoolerEnabled: boolean;
} {
  // Try to get Pooler URL first (preferred for performance)
  const poolerUrl = process.env.SUPABASE_DB_URL;
  const standardUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  // Get appropriate key based on which URL we're using
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Determine which configuration to use
  const isPoolerEnabled = !!poolerUrl && !!serviceRoleKey;
  const url = isPoolerEnabled ? poolerUrl : standardUrl;
  const key = isPoolerEnabled ? serviceRoleKey : anonKey;

  // Validate that at least the fallback configuration is available
  if (!url || !key) {
    throw new Error(
      '❌ Supabase server configuration is incomplete.\n' +
        'Required: Either (SUPABASE_DB_URL + SUPABASE_SERVICE_ROLE_KEY) ' +
        'or (NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY)\n' +
        'Please check your environment variables in Netlify or .env.local'
    );
  }

  return { url, key, isPoolerEnabled };
}

/**
 * Creates a Supabase client optimized for server-side operations
 *
 * Features:
 * - Uses Connection Pooler (Supavisor) when SUPABASE_DB_URL is configured
 * - Automatic fallback to standard URL if pooler is unavailable
 * - No session persistence (not needed on server)
 * - No token auto-refresh (single-request lifecycle)
 * - Connection reuse via pooling reduces latency
 *
 * @returns Configured Supabase client for server-side use
 *
 * @example
 * ```typescript
 * // In API Route
 * import { createServerClient } from '@/lib/supabaseServer';
 *
 * export async function GET() {
 *   const supabase = createServerClient();
 *   const { data } = await supabase.from('terrenos').select('*');
 *   return Response.json(data);
 * }
 * ```
 */
export function createServerClient() {
  const { url, key, isPoolerEnabled } = validateServerEnv();

  // Log which configuration is being used (helpful for debugging)
  if (process.env.NODE_ENV === 'development') {
    console.log(
      isPoolerEnabled
        ? '🔄 [Supabase Server] Using Connection Pooler (Supavisor)'
        : '⚠️  [Supabase Server] Pooler not configured, using standard URL'
    );
  }

  return createClient(url, key, {
    auth: {
      // No session persistence on server-side
      // Sessions are handled by middleware and client-side code
      persistSession: false,

      // No token refresh needed for server-side operations
      // Each request is independent
      autoRefreshToken: false,

      // Don't detect session in URL (not applicable on server)
      detectSessionInUrl: false,
    },

    // Connection pool configuration (when using Supavisor)
    db: {
      // Schema to use for queries (default: 'public')
      schema: 'public',
    },

    // Global options
    global: {
      // Custom headers for identifying server requests (optional, for debugging)
      headers: {
        'X-Client-Info': 'landview-server-pooler',
      },
    },
  });
}

/**
 * Utility function to check if Connection Pooler is enabled
 *
 * Useful for conditional logic or monitoring
 *
 * @returns true if SUPABASE_DB_URL is configured
 */
export function isConnectionPoolerEnabled(): boolean {
  return !!(process.env.SUPABASE_DB_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Gets the current Supabase configuration info (for debugging/monitoring)
 *
 * @returns Object with configuration details (URLs are masked for security)
 */
export function getServerConfigInfo() {
  const poolerUrl = process.env.SUPABASE_DB_URL;
  const standardUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasPooler = isConnectionPoolerEnabled();

  return {
    poolerEnabled: hasPooler,
    poolerUrl: poolerUrl ? `${poolerUrl.slice(0, 20)}...` : null,
    standardUrl: standardUrl ? `${standardUrl.slice(0, 30)}...` : null,
    activeConnection: hasPooler ? 'pooler' : 'standard',
  };
}
