// app/api/products/route.ts
import { verifyJwt } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';
import { errorResponse, successResponse } from '@/lib/response';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const sort = searchParams.get('sort') || 'desc';
    const category = searchParams.get('category') || '';
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 9;

    const skip = (page - 1) * limit;

    const where: any = {};
    if (q) {
      where.name = { contains: q, mode: 'insensitive' };
    }
    if (category) {
      where.category = category;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: sort === 'asc' ? 'asc' : 'desc' },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return successResponse(
      {
        products,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
      'Products fetched successfully'
    );
  } catch (err) {
    console.error(err);
    return errorResponse('Failed to fetch products', 500);
  }
}

// Create product (admin only)
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return errorResponse('Unauthorized', 401);

    const payload = await verifyJwt(token);
    if (!payload || payload.role !== 'admin') {
      return errorResponse('Forbidden', 403);
    }

    const body = await req.json();
    const { name, description, price, stock, category, imageUrl, attributes } =
      body;

    if (!name || !price) {
      return errorResponse('Name and price are required', 400);
    }

    const product = await prisma.product.create({
      data: { name, description, price, stock, category, imageUrl, attributes },
    });

    return successResponse(product, 'Product created successfully');
  } catch (err) {
    console.error(err);
    return errorResponse('Failed to create product', 500);
  }
}
