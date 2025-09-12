// app/api/auth/logout/route.ts
import { successResponse } from '@/lib/response';

export async function POST() {
  const res = successResponse(null, 'Logged out successfully', 200);

  // clear cookie
  res.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  });

  return res;
}
