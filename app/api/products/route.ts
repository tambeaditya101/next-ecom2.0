import { verifyJwt } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';
import { errorResponse, successResponse } from '@/lib/response';
import { NextRequest } from 'next/server';

// Get all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return successResponse(products, 'Products fetched successfully');
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
