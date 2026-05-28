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

    if (!productId || quantity === undefined || quantity < 1) {
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

    // update quantity
    await prisma.cartItem.update({
      where: {
        cart_id_product_id: {
          cart_id: cart.id,
          product_id: parseInt(productId),
        },
      },
      data: { quantity },
    });

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
    await prisma.cartItem.delete({
      where: {
        cart_id_product_id: {
          cart_id: cart.id,
          product_id: parseInt(productId),
        },
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
