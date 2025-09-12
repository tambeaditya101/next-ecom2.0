import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { errorResponse, successResponse } from '@/lib/response';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return errorResponse('Unauthorized', 401);
    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
        // 👈 password is excluded
      },
    });

    if (!dbUser) return errorResponse('User not found', 404);

    return successResponse(dbUser, 'User info retrieved');
  } catch (err) {
    console.error(err);
    return errorResponse('Server error', 500);
  }
}
