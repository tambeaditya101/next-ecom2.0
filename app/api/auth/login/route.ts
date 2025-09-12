import { signJwt } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';
import { errorResponse, successResponse } from '@/lib/response';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return errorResponse('Email and password required', 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return errorResponse('Invalid credentials', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse('Invalid credentials', 401);
    }

    const token = await signJwt({ userId: user.id, role: user.role }, '2h');
    const response = successResponse({ user }, 'Login successful');
    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 2 * 60 * 60, // 2 hours
      sameSite: 'strict',
    });

    return response;
  } catch (err) {
    console.error(err);
    return errorResponse('Server error', 500);
  }
}
