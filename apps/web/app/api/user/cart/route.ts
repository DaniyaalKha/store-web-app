import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { auth } from '@/lib/auth';
import { ensureUserRecord } from '@/lib/ensure-user';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await ensureUserRecord(session.user);

    // get or create cart
    let cart = await prisma.cart.findUnique({
      where: { user_id: session.user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                brand: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          user_id: session.user.id,
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  brand: true,
                },
              },
            },
          },
        },
      });
    }

    // format response
    const items = cart.items as any[];
    const cartItems: any[] = [];
    for (let i = 0; i < items.length; i++) {
      const item: any = items[i];
      const pricePerUnit = typeof item.product.price === 'string'
        ? parseFloat(item.product.price)
        : item.product.price.toNumber();

      cartItems.push({
        id: item.product.id,
        slug: item.product.slug,
        productName: item.product.name,
        brandName: item.product.brand.name,
        image: item.product.image_url || '/store-branding/logo.png',
        quantity: item.quantity,
        pricePerUnit,
        cost: (pricePerUnit * item.quantity).toFixed(2),
      });
    }

    return NextResponse.json({
      cartItems,
      cartCount: cart.items.length,
    });
  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
