import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // ⚡ CRITICAL SAFEGUARD: Explicitly bypass middleware for landing page
  // This prevents cold start issues (26s → <100ms) by avoiding Supabase connection
  // NEVER remove this check - it's the last line of defense against TTFB regression
  if (path === '/') {
    return NextResponse.next();
  }

  // ⚡ Additional safeguards: Skip middleware for public routes and static assets
  const publicRoutes = [
    '/propiedades',
    '/terreno',
    '/servicios-captura',
    '/legal',
    '/api/analytics',
    '/api/health',
  ];

  const isPublicRoute = publicRoutes.some(route => path.startsWith(route));
  const isStaticAsset = path.startsWith('/_next') ||
                        path.startsWith('/static') ||
                        path.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js|woff|woff2|ttf)$/);

  if (isPublicRoute || isStaticAsset) {
    return NextResponse.next();
  }

  // ⚡ From this point onwards, we're ONLY dealing with protected routes
  // Routes that reach here: /dashboard/*, /login, /signup
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // ⚡ CRITICAL ROUTING LOGIC: Prevent redirect loops and respect user navigation

  // 1. User is authenticated and tries to access login/signup
  //    → Redirect to dashboard (they're already logged in)
  if (session && (path === '/login' || path === '/signup')) {
    const redirectUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // 2. User is NOT authenticated and tries to access dashboard
  //    → Redirect to login (authentication required)
  if (!session && path.startsWith('/dashboard')) {
    const redirectUrl = new URL('/login', request.url);
    // Save the original URL to redirect back after login
    redirectUrl.searchParams.set('redirectTo', path);
    return NextResponse.redirect(redirectUrl);
  }

  // 3. All other cases: Let user navigate freely
  //    - Authenticated users can access public pages
  //    - Authenticated users accessing dashboard → allowed
  //    - Login/signup pages → allowed (for logout flow)
  return response;
}

export const config = {
  matcher: [
    /*
     * ⚡ WHITELIST APPROACH - Middleware ONLY runs on these specific routes
     *
     * CRITICAL: The landing page (/) is NOT in this list - it will NEVER execute middleware
     * This prevents Supabase cold starts from blocking the homepage (26s → <100ms TTFB)
     *
     * Routes that REQUIRE middleware (authentication checks):
     * - /dashboard/* (protected area - requires authentication)
     * - /login (session management - redirect if already logged in)
     * - /signup (session management - redirect if already logged in)
     *
     * Routes EXCLUDED from middleware (public pages):
     * - / (landing page) ← CRITICAL FOR PERFORMANCE
     * - /propiedades (public property listing)
     * - /terreno/[id] (public virtual tour viewer)
     * - /servicios-captura (public services page)
     * - /legal/* (legal pages)
     * - /api/analytics/* (public analytics endpoints)
     * - /api/health (health check)
     * - /_next/* (Next.js internals)
     * - /static/* (static assets)
     *
     * ⚠️ WARNING: Adding routes to this matcher will impact TTFB performance
     * Only add routes that absolutely need authentication checks
     */
    '/dashboard/:path*',
    '/login',
    '/signup',
  ],
};
