import { NextRequest, NextResponse } from 'next/server';
import { prisma, CategoryName } from '@repo/database';
import { auth } from '@/lib/auth';

// map UI categories to database CategoryName values
const categoryMapping: Record<string, CategoryName> = {
  CPU: CategoryName.CPU,
  Graphics: CategoryName.GPU,
  Memory: CategoryName.RAM,
  Storage: CategoryName.storage,
  Motherboards: CategoryName.motherboard,
  Power: CategoryName.PSU,
  Cooling: CategoryName.fan,
  Cases: CategoryName.case,
  Accessories: CategoryName.mouse,
};

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // check admin authorisation
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorised' },
        { status: 401 }
      );
    }

    // check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const productId = parseInt(id);

    // check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { brandName, productName, category, description, price, imageUrl, modelUrl, stockQuantity } = body;

    // get or create brand if provided
    let brandId = existingProduct.brand_id;
    if (brandName) {
      let brand = await prisma.brand.findUnique({
        where: { name: brandName },
      });

      if (!brand) {
        brand = await prisma.brand.create({
          data: { name: brandName },
        });
      }
      brandId = brand.id;
    }

    // get category if provided
    let categoryId = existingProduct.category_id;
    if (category) {
      const dbCategory = categoryMapping[category];
      if (!dbCategory) {
        return NextResponse.json(
          { error: 'Invalid category' },
          { status: 400 }
        );
      }

      let categoryRecord = await prisma.category.findUnique({
        where: { name: dbCategory },
      });

      if (!categoryRecord) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 400 }
        );
      }
      categoryId = categoryRecord.id;
    }

    // update product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        brand_id: brandId,
        category_id: categoryId,
        name: productName || existingProduct.name,
        description: description !== undefined ? description : existingProduct.description,
        price: price ? parseFloat(price) : existingProduct.price,
        image_url: imageUrl !== undefined ? imageUrl : existingProduct.image_url,
        model_3d_url: modelUrl !== undefined ? modelUrl : existingProduct.model_3d_url,
        stock_quantity: stockQuantity !== undefined ? parseInt(stockQuantity) : existingProduct.stock_quantity,
      },
      include: {
        brand: true,
        category: true,
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // check admin authorisation
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorised' },
        { status: 401 }
      );
    }

    // check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const productId = parseInt(id);

    // check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // delete product
    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
