import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';

// Types for PostHog API responses
interface PostHogEvent {
  event: string;
  timestamp: string;
  properties: Record<string, any>;
  person?: {
    distinct_id: string;
    properties: Record<string, any>;
  };
}

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  avgTimeSpent: string;
  hotLeads: number;
  conversions: number;
  dailyViews: Array<{
    date: string;
    views: number;
    uniqueVisitors: number;
  }>;
  sceneMetrics: Array<{
    name: string;
    views: number;
    avgTime: number;
    percentage: number;
  }>;
}

/**
 * GET /api/analytics/[slug]
 *
 * Fetches real analytics data from PostHog for a specific property
 * Query params:
 * - timeRange: '7d' | '30d' | 'all' (default: '30d')
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '30d';

    // Validate required environment variables
    const posthogApiKey = process.env.POSTHOG_PERSONAL_API_KEY;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

    if (!posthogApiKey) {
      console.error('❌ POSTHOG_PERSONAL_API_KEY is not set in .env.local');
      return NextResponse.json(
        { error: 'PostHog API key not configured' },
        { status: 500 }
      );
    }

    // Get terrain data from Supabase to get the ID
    const supabase = createClient();
    const { data: terrain, error: terrainError } = await supabase
      .from('terrenos')
      .select('id, title')
      .eq('slug', slug)
      .single();

    if (terrainError || !terrain) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const tourId = terrain.id;

    // Calculate date range
    const now = new Date();
    const daysMap = { '7d': 7, '30d': 30, all: 365 };
    const days = daysMap[timeRange as keyof typeof daysMap] || 30;
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // Base URL for PostHog API
    const baseUrl = posthogHost.replace(/\/$/, '');
    const headers = {
      Authorization: `Bearer ${posthogApiKey}`,
      'Content-Type': 'application/json',
    };

    // Helper function to fetch PostHog events using the Events API
    async function fetchPostHogEvents(eventName: string, propertyFilter?: any) {
      const url = new URL(`${baseUrl}/api/event/`);
      url.searchParams.append('event', eventName);

      // Add tour_id filter
      if (propertyFilter) {
        url.searchParams.append('properties', JSON.stringify([propertyFilter]));
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `PostHog API error for ${eventName}:`,
          response.status,
          errorText
        );
        return { results: [] };
      }

      const data = await response.json();
      return data;
    }

    // Fetch events from PostHog using the simpler Events API
    // Note: PostHog API has different endpoints, we'll use the events endpoint
    const eventsUrl = `${baseUrl}/api/event/`;

    // Fetch pageviews (filtering by URL containing slug)
    const pageviewsResponse = await fetch(
      `${eventsUrl}?event=$pageview&properties=${encodeURIComponent(JSON.stringify([{ key: '$current_url', value: `/terreno/${slug}`, operator: 'icontains' }]))}`,
      { headers }
    );

    // Fetch tour-specific events
    const tourFilter = { key: 'tour_id', value: tourId, operator: 'exact' };

    const [
      pageviewsData,
      sceneViewsResponse,
      sceneTimesResponse,
      highInterestResponse,
      contactClicksResponse,
    ] = await Promise.all([
      pageviewsResponse.ok ? pageviewsResponse.json() : { results: [] },
      fetch(
        `${eventsUrl}?event=tour_scene_view&properties=${encodeURIComponent(JSON.stringify([tourFilter]))}`,
        { headers }
      ),
      fetch(
        `${eventsUrl}?event=tour_scene_time&properties=${encodeURIComponent(JSON.stringify([tourFilter]))}`,
        { headers }
      ),
      fetch(
        `${eventsUrl}?event=tour_high_interest&properties=${encodeURIComponent(JSON.stringify([tourFilter]))}`,
        { headers }
      ),
      fetch(
        `${eventsUrl}?event=tour_contact_click&properties=${encodeURIComponent(JSON.stringify([tourFilter]))}`,
        { headers }
      ),
    ]);

    const sceneViewsData = sceneViewsResponse.ok
      ? await sceneViewsResponse.json()
      : { results: [] };
    const sceneTimesData = sceneTimesResponse.ok
      ? await sceneTimesResponse.json()
      : { results: [] };
    const highInterestData = highInterestResponse.ok
      ? await highInterestResponse.json()
      : { results: [] };
    const contactClicksData = contactClicksResponse.ok
      ? await contactClicksResponse.json()
      : { results: [] };

    // Process the data
    const pageviews = pageviewsData.results || [];
    const sceneViews = sceneViewsData.results || [];
    const sceneTimes = sceneTimesData.results || [];
    const highInterest = highInterestData.results || [];
    const contactClicks = contactClicksData.results || [];

    // Filter events by date range
    const filterByDate = (events: PostHogEvent[]) =>
      events.filter((event) => {
        const eventDate = new Date(event.timestamp);
        return eventDate >= startDate && eventDate <= now;
      });

    const filteredPageviews = filterByDate(pageviews);
    const filteredSceneViews = filterByDate(sceneViews);
    const filteredSceneTimes = filterByDate(sceneTimes);
    const filteredHighInterest = filterByDate(highInterest);
    const filteredContactClicks = filterByDate(contactClicks);

    // Calculate total views
    const totalViews = filteredPageviews.length;

    // Calculate unique visitors
    const uniqueVisitors = new Set(
      filteredPageviews.map(
        (event: PostHogEvent) => event.person?.distinct_id || 'unknown'
      )
    ).size;

    // Calculate average time spent
    const totalTimeSpent = filteredSceneTimes.reduce(
      (sum: number, event: PostHogEvent) =>
        sum + (event.properties?.time_spent_seconds || 0),
      0
    );
    const avgTimeSeconds =
      filteredSceneTimes.length > 0 ? totalTimeSpent / filteredSceneTimes.length : 0;
    const avgTimeMinutes = Math.floor(avgTimeSeconds / 60);
    const avgTimeSecondsRemainder = Math.floor(avgTimeSeconds % 60);
    const avgTimeSpent = `${avgTimeMinutes}:${avgTimeSecondsRemainder.toString().padStart(2, '0')}`;

    // Calculate hot leads (users with high interest)
    const hotLeadsSet = new Set(
      filteredHighInterest.map(
        (event: PostHogEvent) => event.person?.distinct_id || 'unknown'
      )
    );
    const hotLeads = hotLeadsSet.size;

    // Calculate conversions (contact clicks)
    const conversions = filteredContactClicks.length;

    // Calculate daily views
    const dailyViewsMap = new Map<string, { views: number; visitors: Set<string> }>();

    filteredPageviews.forEach((event: PostHogEvent) => {
      const date = new Date(event.timestamp)
        .toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })
        .replace('.', '');

      if (!dailyViewsMap.has(date)) {
        dailyViewsMap.set(date, { views: 0, visitors: new Set() });
      }

      const dayData = dailyViewsMap.get(date)!;
      dayData.views += 1;
      dayData.visitors.add(event.person?.distinct_id || 'unknown');
    });

    const dailyViews = Array.from(dailyViewsMap.entries())
      .map(([date, data]) => ({
        date,
        views: data.views,
        uniqueVisitors: data.visitors.size,
      }))
      .sort((a, b) => {
        // Sort chronologically
        const parseDate = (dateStr: string) => {
          const months: { [key: string]: number } = {
            ene: 0,
            feb: 1,
            mar: 2,
            abr: 3,
            may: 4,
            jun: 5,
            jul: 6,
            ago: 7,
            sep: 8,
            oct: 9,
            nov: 10,
            dic: 11,
          };
          const [day, month] = dateStr.split(' ');
          return new Date(now.getFullYear(), months[month], parseInt(day));
        };
        return parseDate(a.date).getTime() - parseDate(b.date).getTime();
      });

    // Calculate scene metrics (most viewed scenes)
    const sceneMetricsMap = new Map<
      number,
      { views: number; totalTime: number; timeCount: number }
    >();

    filteredSceneViews.forEach((event: PostHogEvent) => {
      const sceneIndex = event.properties?.scene_index;
      if (typeof sceneIndex !== 'number') return;

      if (!sceneMetricsMap.has(sceneIndex)) {
        sceneMetricsMap.set(sceneIndex, { views: 0, totalTime: 0, timeCount: 0 });
      }

      const sceneData = sceneMetricsMap.get(sceneIndex)!;
      sceneData.views += 1;
    });

    filteredSceneTimes.forEach((event: PostHogEvent) => {
      const sceneIndex = event.properties?.scene_index;
      const timeSpent = event.properties?.time_spent_seconds;
      if (typeof sceneIndex !== 'number' || typeof timeSpent !== 'number') return;

      if (!sceneMetricsMap.has(sceneIndex)) {
        sceneMetricsMap.set(sceneIndex, { views: 0, totalTime: 0, timeCount: 0 });
      }

      const sceneData = sceneMetricsMap.get(sceneIndex)!;
      sceneData.totalTime += timeSpent;
      sceneData.timeCount += 1;
    });

    // Convert to array and calculate percentages
    const sceneMetrics = Array.from(sceneMetricsMap.entries())
      .map(([sceneIndex, data]) => ({
        name: `Vista ${sceneIndex + 1}`,
        views: data.views,
        avgTime: data.timeCount > 0 ? Math.round(data.totalTime / data.timeCount) : 0,
        percentage: 0, // Will be calculated below
      }))
      .sort((a, b) => b.views - a.views);

    // Calculate percentages based on max views
    const maxViews = sceneMetrics[0]?.views || 1;
    sceneMetrics.forEach((scene) => {
      scene.percentage = Math.round((scene.views / maxViews) * 100);
    });

    // Prepare response
    const analyticsData: AnalyticsData = {
      totalViews,
      uniqueVisitors,
      avgTimeSpent,
      hotLeads,
      conversions,
      dailyViews,
      sceneMetrics: sceneMetrics.slice(0, 6), // Top 6 scenes
    };

    console.log('✅ Analytics data fetched successfully:', {
      slug,
      tourId,
      totalViews,
      uniqueVisitors,
      conversions,
    });

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('❌ Error fetching analytics:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch analytics',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
