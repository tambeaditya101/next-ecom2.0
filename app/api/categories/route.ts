// app/api/categories/route.ts
import { prisma } from '@/lib/prisma';
import { errorResponse, successResponse } from '@/lib/response';

export async function GET() {
  try {
    const categories = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category'], // ✅ unique categories only
      where: { category: { not: null } },
    });

    const categoryList = categories.map((c) => c.category);

    return successResponse(categoryList, 'Categories fetched successfully');
  } catch (err) {
    console.error(err);
    return errorResponse('Failed to fetch categories', 500);
  }
}
