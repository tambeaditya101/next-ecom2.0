import { signJwt } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';
import { errorResponse, successResponse } from '@/lib/response';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password, username, role } = await req.json();

    if (!email || !password) {
      return errorResponse('Email and password required', 400);
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return errorResponse('Email already registered', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        role: role || 'customer',
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    // Sign JWT and set HttpOnly cookie
    const token = await signJwt({ userId: user.id, role: user.role }, '2h');
    const response = successResponse({ user }, 'Signup successful');
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
