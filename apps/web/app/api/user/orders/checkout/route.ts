import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // get user's cart with items
    const cart = await prisma.cart.findUnique({
      where: { user_id: session.user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // check stock for all items
    for (const item of cart.items) {
      if (item.product.stock_quantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.product.name}` },
          { status: 400 }
        );
      }
    }

    // create order
    const order = await prisma.order.create({
      data: {
        user_id: session.user.id,
        status: 'pending',
      },
    });

    // create order products and decrease stock for each cart item
    for (const item of cart.items) {
      await prisma.orderProduct.create({
        data: {
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
        },
      });

      // Decrease product stock
      await prisma.product.update({
        where: { id: item.product_id },
        data: {
          stock_quantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    // delete all cart items for this user
    await prisma.cartItem.deleteMany({
      where: {
        cart_id: cart.id,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      success: true,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
