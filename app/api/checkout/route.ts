import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Request cart type
type CheckoutItem = {
  id: number; // productId
  quantity: number;
};

type CheckoutBody = {
  cart: CheckoutItem[];
  userId: number; // link order to user
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutBody;
    const { cart, userId } = body;

    // --- Basic validations ---
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'UserId required' }, { status: 400 });
    }

    for (const item of cart) {
      if (!item.id || item.quantity <= 0) {
        return NextResponse.json(
          { error: `Invalid cart item format` },
          { status: 400 }
        );
      }
    }

    // --- 1. Validate stock ---
    for (const item of cart) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product with id ${item.id} not found` },
          { status: 404 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Not enough stock for ${product.name}. Available: ${product.stock}`,
          },
          { status: 400 }
        );
      }
    }

    // --- 2. Transaction: create order + reduce stock ---
    const result = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: cart.map((c) => c.id) } },
      });

      // Calculate total & prepare order items
      const orderItemsData = products.map((product) => {
        const item = cart.find((c) => c.id === product.id)!;
        return {
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        };
      });

      const total = orderItemsData.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      // Create order + order items
      const order = await tx.order.create({
        data: {
          userId,
          total,
          status: 'paid', // set "pending" if payment integration comes later
          items: {
            create: orderItemsData,
          },
        },
        include: { items: true },
      });

      // Reduce stock
      await Promise.all(
        cart.map((item) =>
          tx.product.update({
            where: { id: item.id },
            data: {
              stock: { decrement: item.quantity },
            },
          })
        )
      );

      // Fetch updated stock for frontend
      const updatedProducts = await tx.product.findMany({
        where: { id: { in: cart.map((c) => c.id) } },
        select: { id: true, stock: true },
      });

      return { order, updatedProducts };
    });

    return NextResponse.json({
      message: 'Checkout successful',
      order: result.order,
      updatedProducts: result.updatedProducts,
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === 'development'
            ? error.message
            : 'Something went wrong',
      },
      { status: 500 }
    );
  }
}
