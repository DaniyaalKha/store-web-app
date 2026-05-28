import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { orderId } = await params;
    const orderIdNum = parseInt(orderId, 10);

    if (isNaN(orderIdNum)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    // get order details
    const order = await prisma.order.findUnique({
      where: { id: orderIdNum },
      include: {
        user: true,
        products: {
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

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // verify order belongs to user
    if (order.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // format response
    const formattedProducts = order.products.map((op) => ({
      id: op.product.id,
      name: op.product.name,
      quantity: op.quantity,
      price: typeof op.product.price === 'string'
        ? parseFloat(op.product.price)
        : op.product.price.toNumber(),
      imageUrl: op.product.image_url,
    }));

    const total = formattedProducts
      .reduce((sum, p) => sum + p.price * p.quantity, 0)
      .toFixed(2);

    const orderNumber = `ORD-${String(order.id).padStart(5, '0')}`;

    return NextResponse.json({
      id: order.id,
      orderNumber,
      date: new Date(order.order_time).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      status: order.status,
      customerName: `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim(),
      email: order.user.email,
      address: order.user.address || 'N/A',
      city: order.user.city || 'N/A',
      state: order.user.state || 'N/A',
      country: order.user.country || 'N/A',
      products: formattedProducts,
      total: `$${total}`,
    });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
