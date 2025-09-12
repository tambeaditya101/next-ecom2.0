// lib/auth.ts
import { NextRequest } from 'next/server';

export function getUserFromRequest(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  const role = req.headers.get('x-user-role');
  if (!userId) return null;
  return { userId: Number(userId), role: role || 'customer' };
}
