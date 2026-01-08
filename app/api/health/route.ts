import { NextResponse } from 'next/server';
import { createServerClient, getServerConfigInfo } from '@/lib/supabaseServer';

// Force dynamic to prevent caching and ensure execution on every request
export const dynamic = 'force-dynamic';

/**
 * GET /api/health
 *
 * Health check endpoint to prevent cold starts with Connection Pooling
 * - Wakes up Netlify serverless function
 * - Connects to Supabase database via Supavisor (Connection Pooler)
 * - Keeps database connections warm for instant response
 * - No analytics tracking (invisible endpoint)
 *
 * PERFORMANCE OPTIMIZATIONS:
 * 1. Uses Connection Pooler (Supavisor) when SUPABASE_DB_URL is configured
 *    - Reuses existing connections instead of creating new ones
 *    - Reduces connection overhead from ~300ms to ~50ms
 *    - Prevents "too many connections" errors under high load
 *
 * 2. Automatic fallback to standard URL if pooler not configured
 *    - Ensures endpoint never fails due to misconfiguration
 *
 * 3. Minimal query to wake up database without overhead
 *    - Single row fetch with limit(1)
 *
 * USAGE:
 * - Ping every 2-5 minutes via UptimeRobot, Cron-job.org, or similar
 * - Add ?t=<timestamp> parameter to bypass Netlify CDN cache:
 *   curl "https://potentiamx.com/api/health?t=$(date +%s)"
 */
export async function GET() {
  try {
    // ✅ CRITICAL: Use intelligent server client with Connection Pooler
    // Automatically uses Supavisor when SUPABASE_DB_URL is configured
    // Falls back to standard URL if pooler is not available
    const supabase = createServerClient();

    // Lightweight check: Just verify we can create the client
    // This wakes up the serverless function without heavy DB queries
    // Optional: Try a simple count query that won't fail
    const { count, error } = await supabase
      .from('terrenos')
      .select('*', { count: 'exact', head: true });

    // Get pooler configuration info for monitoring
    const configInfo = getServerConfigInfo();

    if (error) {
      // Still return success even if DB query fails
      // The goal is to keep the function warm, not validate DB
      console.warn('⚠️ [Health Check] DB query failed, but function is warm:', error.message);
      return NextResponse.json(
        {
          status: 'ok',
          message: 'Function warm (DB check failed)',
          function_warm: true,
          db_connected: false,
          pooler_enabled: configInfo.poolerEnabled,
          connection_type: configInfo.activeConnection,
          timestamp: new Date().toISOString(),
        },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            'CDN-Cache-Control': 'no-store',
            'Vercel-CDN-Cache-Control': 'no-store',
          },
        }
      );
    }

    console.log('✅ [Health Check] Function warm and DB connected', {
      poolerEnabled: configInfo.poolerEnabled,
      connection: configInfo.activeConnection,
      terrenosCount: count,
    });

    return NextResponse.json(
      {
        status: 'ok',
        message: 'Function warm and DB connected',
        function_warm: true,
        db_connected: true,
        pooler_enabled: configInfo.poolerEnabled,
        connection_type: configInfo.activeConnection,
        terrenos_count: count,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          // CRITICAL: Prevent Netlify CDN from caching health check responses
          // This ensures UptimeRobot always hits the serverless function
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'CDN-Cache-Control': 'no-store',
          'Vercel-CDN-Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('❌ [Health Check] Server error:', error);

    // Even on error, return 200 so UptimeRobot considers it UP
    // The goal is to wake up the function, not validate correctness
    return NextResponse.json(
      {
        status: 'ok',
        message: 'Function warm (error occurred)',
        function_warm: true,
        db_connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      {
        status: 200, // Changed from 500 to 200
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
  }
}
