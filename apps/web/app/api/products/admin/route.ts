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
  Accessories: CategoryName.mouse, // handled differently to combine keyboards, monitors, cables
};

// helper to convert category name back to UI format
const categoryReverseMapping: Record<CategoryName, string> = {
  [CategoryName.CPU]: 'CPU',
  [CategoryName.GPU]: 'Graphics',
  [CategoryName.RAM]: 'Memory',
  [CategoryName.storage]: 'Storage',
  [CategoryName.motherboard]: 'Motherboards',
  [CategoryName.PSU]: 'Power',
  [CategoryName.fan]: 'Cooling',
  [CategoryName.case]: 'Cases',
  [CategoryName.mouse]: 'Accessories',
  [CategoryName.cable]: 'Accessories',
  [CategoryName.keyboard]: 'Accessories',
  [CategoryName.monitor]: 'Accessories',
};

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { brandName, productName, category, description, price, imageUrl, modelUrl, stockQuantity } = body;

    // validate required fields
    if (!brandName || !productName || !category || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // get or create brand
    let brand = await prisma.brand.findUnique({
      where: { name: brandName },
    });

    if (!brand) {
      brand = await prisma.brand.create({
        data: { name: brandName },
      });
    }

    // get category from database
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

    // create slug from product name
    const slug = productName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // create product
    const product = await prisma.product.create({
      data: {
        brand_id: brand.id,
        category_id: categoryRecord.id,
        name: productName,
        slug: slug + '-' + Date.now(), // ensure unique slug
        description: description || null,
        price: parseFloat(price),
        image_url: imageUrl || null,
        model_3d_url: modelUrl || null,
        stock_quantity: parseInt(stockQuantity) || 0,
      },
      include: {
        brand: true,
        category: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
