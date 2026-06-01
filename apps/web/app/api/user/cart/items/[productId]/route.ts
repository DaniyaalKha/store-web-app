import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { auth } from '@/lib/auth';

interface RouteParams {
  params: Promise<{
    productId: string;
  }>;
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { quantity } = body;
    const { productId } = await params;
    const productIdValue = Number.parseInt(productId, 10);

    if (!productId || !Number.isInteger(productIdValue) || quantity === undefined || quantity < 0) {
      return NextResponse.json(
        { error: 'Invalid product ID or quantity' },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { user_id: session.user.id },
    });

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    // If quantity is 0, delete the item
    if (quantity === 0) {
      await prisma.cartItem.deleteMany({
        where: {
          cart_id: cart.id,
          product_id: productIdValue,
        },
      });
    } else {
      // update quantity
      await prisma.cartItem.updateMany({
        where: {
          cart_id: cart.id,
          product_id: productIdValue,
        },
        data: { quantity },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorised' },
        { status: 401 }
      );
    }

    const { productId } = await params;
    const productIdValue = Number.parseInt(productId, 10);

    if (!productId || !Number.isInteger(productIdValue)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { user_id: session.user.id },
    });

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    // Remove item
    await prisma.cartItem.deleteMany({
      where: {
        cart_id: cart.id,
        product_id: productIdValue,
      },
    });

    // get updated cart count
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: true },
    });

    return NextResponse.json({
      success: true,
      cartCount: updatedCart?.items.length || 0,
    });
  } catch (error) {
    console.error('Delete from cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
