import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
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

  const path = request.nextUrl.pathname;

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
  //    - Authenticated users can access public pages (/propiedades, /, etc.)
  //    - Unauthenticated users can access public pages
  //    - Authenticated users accessing dashboard → allowed
  return response;
}

export const config = {
  matcher: [
    /*
     * CRÍTICO PERFORMANCE: Solo ejecutar middleware en rutas que REQUIEREN autenticación
     * La landing page (/) NO necesita middleware - excluirla mejora TTFB de 11s a <100ms
     *
     * Rutas que SÍ requieren middleware:
     * - /dashboard/* (requiere autenticación)
     * - /login y /signup (manejo de sesiones)
     *
     * Rutas excluidas (NO ejecutar middleware):
     * - / (landing page - CRÍTICO para performance)
     * - /propiedades (página pública)
     * - /terreno/[id] (vista pública del tour)
     * - /legal/* (páginas legales públicas)
     * - _next/static, _next/image (archivos estáticos)
     * - Archivos estáticos (.png, .jpg, .css, .js, etc.)
     * - api/* (rutas API)
     */
    '/dashboard/:path*',
    '/login',
    '/signup',
  ],
};
