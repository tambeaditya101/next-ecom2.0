import { verifyJwt } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';
import { errorResponse, successResponse } from '@/lib/response';
import { NextRequest } from 'next/server';

// Get all products with filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const q = searchParams.get('q') || '';
    const sort = searchParams.get('sort') || 'newest';
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '9', 10);

    // Prisma "where" clause
    const where: any = {};

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    // Prisma "orderBy"
    let orderBy: any = { createdAt: 'desc' }; // default newest
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };

    const skip = (page - 1) * limit;

    // Fetch products
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return successResponse(
      { products, totalPages, total },
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
