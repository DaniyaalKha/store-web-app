import { NextRequest, NextResponse } from "next/server";
import { prisma, Prisma } from "@repo/database";

type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    user: true;
    products: {
      include: {
        product: true;
      };
    };
  };
}>;

export async function GET(request: NextRequest) {
  try {
    // Fetch all orders with user and product information
    const orders: OrderWithRelations[] = await prisma.order.findMany({
      include: {
        user: true,
        products: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        order_time: "desc",
      },
    });

    // Format the response
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      user: {
        email: order.user.email,
        firstName: order.user.firstName,
        lastName: order.user.lastName,
        address: order.user.address,
        city: order.user.city,
        state: order.user.state,
        country: order.user.country,
      },
      status: order.status,
      order_time: order.order_time,
      products: order.products.map((op) => ({
        product_id: op.product_id,
        product_name: op.product.name,
        quantity: op.quantity,
        price: op.product.price,
      })),
    }));

    return NextResponse.json(formattedOrders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
