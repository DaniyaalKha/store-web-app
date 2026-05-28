import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // get the session
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // get all orders for the user with their products
    const orders = await prisma.order.findMany({
      where: { user_id: session.user.id },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { order_time: 'desc' },
    });

    // format the response
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: `ORD-${String(order.id).padStart(3, '0')}`,
      date: order.order_time.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      status: order.status,
      total: order.products
        .reduce((sum, op) => {
          const price = typeof op.product.price === 'string'
            ? parseFloat(op.product.price)
            : op.product.price.toNumber();
          return sum + price * op.quantity;
        }, 0)
        .toFixed(2),
      products: order.products.map((op) => ({
        id: op.product.id,
        name: op.product.name,
        quantity: op.quantity,
        price: typeof op.product.price === 'string'
          ? parseFloat(op.product.price)
          : op.product.price.toNumber(),
        imageUrl: op.product.image_url || '/store-branding/logo.png',
      })),
      orderTime: order.order_time.toISOString(),
    }));

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
