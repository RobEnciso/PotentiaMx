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

    // Minimal query to wake up database connection
    // Using .single() to force query execution (not just count)
    const { data, error } = await supabase
      .from('terrenos')
      .select('id')
      .limit(1)
      .single();

    if (error) {
      console.error('❌ [Health Check] DB query failed:', error);
      return NextResponse.json(
        {
          status: 'degraded',
          message: 'DB query failed',
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        {
          status: 500,
          headers: {
            // CRITICAL: Prevent Netlify from caching error responses
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          },
        }
      );
    }

    // Get pooler configuration info for monitoring
    const configInfo = getServerConfigInfo();

    console.log('✅ [Health Check] DB Connected successfully', {
      poolerEnabled: configInfo.poolerEnabled,
      connection: configInfo.activeConnection,
    });

    return NextResponse.json(
      {
        status: 'ok',
        message: 'DB Connected',
        db_connected: true,
        pooler_enabled: configInfo.poolerEnabled,
        connection_type: configInfo.activeConnection,
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
    return NextResponse.json(
      {
        status: 'error',
        message: 'Server error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
  }
}
