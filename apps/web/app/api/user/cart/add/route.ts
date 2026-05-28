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

    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { user_id: session.user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          user_id: session.user.id,
        },
      });
    }

    // Check if product already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cart_id_product_id: {
          cart_id: cart.id,
          product_id: productId,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: {
          cart_id_product_id: {
            cart_id: cart.id,
            product_id: productId,
          },
        },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });
    } else {
      // Add new item
      await prisma.cartItem.create({
        data: {
          cart_id: cart.id,
          product_id: productId,
          quantity,
        },
      });
    }

    // Get updated cart count
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: true },
    });

    return NextResponse.json({
      success: true,
      cartCount: updatedCart?.items.length || 0,
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
