import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /about, /dashboard)
  const path = request.nextUrl.pathname;

  // Define paths that are considered public (accessible without authentication)
  const isPublicPath = path === '/auth/login' || path === '/auth/register' || path === '/';

  // Define paths that require authentication
  const isAuthPath = path.startsWith('/auth/');
  const isDashboardPath = path.startsWith('/dashboard');

  // Get the token from the request
  const token = request.cookies.get('token')?.value || '';

  // If user is trying to access auth pages while logged in, redirect to home
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  // If user is trying to access dashboard without token, redirect to login
  if (isDashboardPath && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.nextUrl));
  }

  // Allow the request to continue
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
