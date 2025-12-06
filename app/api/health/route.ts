import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';

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
 * Usage: Ping this endpoint every 5-10 minutes via external service
 * (UptimeRobot, Cron-job.org, etc.)
 */
export async function GET() {
  try {
    // Create Supabase client
    const supabase = createClient();

    // Minimal query to wake up database connection
    // Select only ID from first row to minimize data transfer
    const { data, error } = await supabase
      .from('terrenos')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Health check DB query failed:', error);
      return NextResponse.json(
        {
          status: 'degraded',
          message: 'DB query failed',
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'ok',
      message: 'DB Connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Server error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
