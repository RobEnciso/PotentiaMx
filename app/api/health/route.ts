import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic to prevent caching and ensure execution on every request
export const dynamic = 'force-dynamic';

/**
 * GET /api/health
 *
 * Health check endpoint to prevent cold starts
 * - Wakes up Netlify serverless function
 * - Connects to Supabase database with minimal query
 * - No analytics tracking (invisible endpoint)
 *
 * CRITICAL FIX: Uses server-side Supabase client (@supabase/supabase-js)
 * instead of browser client to prevent timeouts and connection issues
 *
 * Usage: Ping this endpoint every 2-5 minutes via external service
 * (UptimeRobot, Cron-job.org, etc.)
 */
export async function GET() {
  try {
    // ✅ CRITICAL: Use server-side Supabase client
    // createBrowserClient from @supabase/ssr causes timeouts in API Routes
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false, // No session persistence on server
          autoRefreshToken: false, // No token refresh needed for health check
        },
      }
    );

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

    console.log('✅ [Health Check] DB Connected successfully');

    return NextResponse.json(
      {
        status: 'ok',
        message: 'DB Connected',
        db_connected: true,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          // CRITICAL: Prevent Netlify CDN from caching health check responses
          // This ensures UptimeRobot always hits the serverless function
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
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
