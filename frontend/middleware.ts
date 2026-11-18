import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Skip middleware for auth callback and API routes
  if (request.nextUrl.pathname.startsWith('/auth/callback') || 
      request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const isLoginPage = request.nextUrl.pathname === '/login';
  const isPublicPage = request.nextUrl.pathname === '/';

  // Allow access to public pages
  if (isPublicPage) {
    return NextResponse.next();
  }

  // If trying to access login page while authenticated, redirect to home
  if (isLoginPage) {
    return NextResponse.next();
  }

  // For all other routes, let the client-side handle auth
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 