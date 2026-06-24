import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the root landing page (/) and the competitions dashboard
  // If they try to go anywhere else (like /vault), redirect them to the landing page
  if (pathname !== '/' && pathname !== '/competitions') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes EXCEPT api, static files, images, and favicon
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};