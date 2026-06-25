import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The comprehensive list of valid routes within the application lifecycle
  const allowedRoutes = [
    '/',
    '/competitions',
    '/dashboard',
    '/documents',
    '/essays',
    '/extracurriculars',
    '/onboarding',
    '/universities'
  ];

  // Redirect the client back to home if the path requested isn't in the explicit list
  if (!allowedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Intercepts all operational routes except static framework resources, api points, and assets
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
