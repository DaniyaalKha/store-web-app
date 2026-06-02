import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { auth } from '@/lib/auth';
import { ensureUserRecord } from '@/lib/ensure-user';

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorised' },
        { status: 401 }
      );
    }

    await ensureUserRecord(session.user);

    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const productIdValue = typeof productId === 'number'
      ? productId
      : Number.parseInt(productId, 10);

    const quantityValue = typeof quantity === 'number'
      ? quantity
      : Number.parseInt(quantity, 10);

    if (!Number.isInteger(productIdValue)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    if (!Number.isInteger(quantityValue) || quantityValue < 1) {
      return NextResponse.json(
        { error: 'Invalid quantity' },
        { status: 400 }
      );
    }

    // get product to check stock
    const product = await prisma.product.findUnique({
      where: { id: productIdValue },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.stock_quantity < quantityValue) {
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
        product_id: productIdValue,
        quantity: quantityValue,
      },
    });

    // decrease product stock
    await prisma.product.update({
      where: { id: productIdValue },
      data: {
        stock_quantity: {
          decrement: quantityValue,
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
