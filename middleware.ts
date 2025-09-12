// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from './lib/jwt';

export async function middleware(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { data: null, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await verifyJwt(token);
    if (!payload) {
      return NextResponse.json(
        { data: null, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Attach user info to headers for downstream API routes
    const headers = new Headers(req.headers);
    headers.set('x-user-id', String(payload.userId));
    headers.set('x-user-role', payload.role || '');

    return NextResponse.next({ request: { headers } });
  } catch (err) {
    return NextResponse.json(
      { data: null, message: 'Unauthorized' },
      { status: 401 }
    );
  }
}

// Apply only to protected routes
export const config = {
  matcher: [
    '/cart/:path*',
    '/wishlist/:path*',
    '/checkout/:path*',
    '/profile/:path*',
    '/api/auth/me', // add me route here
    // add other protected API routes as needed
  ],
};
