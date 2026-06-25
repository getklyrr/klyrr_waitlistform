import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  // Only redirect if the route isn't explicitly allowed
  if (!allowedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
