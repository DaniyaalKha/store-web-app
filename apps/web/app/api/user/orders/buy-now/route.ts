import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorised' },
        { status: 401 }
      );
    }

    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // get product to check stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.stock_quantity < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // create order
    const order = await prisma.order.create({
      data: {
        user_id: session.user.id,
        status: 'pending',
      },
    });

    // create order product
    await prisma.orderProduct.create({
      data: {
        order_id: order.id,
        product_id: productId,
        quantity,
      },
    });

    // decrease product stock
    await prisma.product.update({
      where: { id: productId },
      data: {
        stock_quantity: {
          decrement: quantity,
        },
      },
    });

    return NextResponse.json({
      orderId: order.id,
      success: true,
    });
  } catch (error) {
    console.error('Buy now error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
