// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from './lib/jwt';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  // Disable caching → always check fresh

  // If no token → handle unauthorized
  if (!token) {
    return handleUnauthorized(req);
  }

  // Verify token
  let payload;
  try {
    payload = await verifyJwt(token);
  } catch {
    return handleUnauthorized(req);
  }

  if (!payload) {
    return handleUnauthorized(req);
  }
  const res = NextResponse.next();

  // Attach user info
  res.headers.set('x-user-id', String(payload.userId));
  res.headers.set('x-user-role', payload.role || '');
  res.headers.set('Cache-Control', 'no-store');

  return res;
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

  if (pathname === '/unauthorized') {
    return NextResponse.next(); // don’t redirect loop
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
