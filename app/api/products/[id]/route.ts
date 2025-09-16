import { verifyJwt } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';
import { errorResponse, successResponse } from '@/lib/response';
import { NextRequest } from 'next/server';

// Get single product
export async function GET(_req: NextRequest, context: any) {
  try {
    const { id } = context.params;

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) return errorResponse('Product not found', 404);

    return successResponse(product, 'Product fetched successfully');
  } catch (err) {
    console.error(err);
    return errorResponse('Failed to fetch product', 500);
  }
}

// Update product (admin only)
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    const token = req.cookies.get('token')?.value;
    if (!token) return errorResponse('Unauthorized', 401);

    const payload = await verifyJwt(token);
    if (!payload || payload.role !== 'admin') {
      return errorResponse('Forbidden', 403);
    }

    const body = await req.json();
    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data: body,
    });

    return successResponse(updated, 'Product updated successfully');
  } catch (err) {
    console.error(err);
    return errorResponse('Failed to update product', 500);
  }
}

// Delete product (admin only)
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    const token = req.cookies.get('token')?.value;
    if (!token) return errorResponse('Unauthorized', 401);

    const payload = await verifyJwt(token);
    if (!payload || payload.role !== 'admin') {
      return errorResponse('Forbidden', 403);
    }

    await prisma.product.delete({ where: { id: Number(id) } });
    return successResponse(null, 'Product deleted successfully');
  } catch (err) {
    console.error(err);
    return errorResponse('Failed to delete product', 500);
  }
}
