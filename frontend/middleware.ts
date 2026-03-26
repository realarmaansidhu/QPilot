/**
 * QPilot Auth Middleware
 * Protects app routes, redirects unauthenticated users to /login,
 * and redirects logged-in users away from /login to /dashboard.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const PROTECTED_PATHS = ['/dashboard', '/screener', '/stock', '/watchlist', '/settings', '/onboarding'];

export async function middleware(req: NextRequest) {
  const { supabaseResponse, user } = await updateSession(req);

  const isProtected = PROTECTED_PATHS.some(p => req.nextUrl.pathname.startsWith(p));

  // Redirect unauthenticated users to login
  if (isProtected && !user) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('next', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users away from /login
  if (user && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Run on all routes except static files and API auth callback
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
};
