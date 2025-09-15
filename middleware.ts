// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from './lib/jwt';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  // If no token → handle differently for API vs Pages
  if (!token) {
    return handleUnauthorized(req);
  }

  // Verify token
  const payload = await verifyJwt(token).catch(() => null);
  if (!payload) {
    return handleUnauthorized(req);
  }

  // Attach user info for downstream API usage
  const headers = new Headers(req.headers);
  headers.set('x-user-id', String(payload.userId));
  headers.set('x-user-role', payload.role || '');

  return NextResponse.next({ request: { headers } });
}

function handleUnauthorized(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // If request is for API → return JSON
  if (pathname.startsWith('/api')) {
    return NextResponse.json(
      { data: null, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  // If request is for a page → redirect to login
  const loginUrl = new URL('/unauthorized', req.url);
  return NextResponse.redirect(loginUrl);
}

// Protect both frontend & backend routes
export const config = {
  matcher: [
    '/cart/:path*',
    '/wishlist/:path*',
    '/checkout/:path*',
    '/profile/:path*',
    '/api/cart/:path*',
    '/api/wishlist/:path*',
    '/api/checkout/:path*',
    '/api/profile/:path*',
  ],
};
