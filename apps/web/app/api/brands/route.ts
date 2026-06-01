import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { auth } from '@/lib/auth';

// GET all brands
export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}

// POST create new brand
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
    const { name, logoUrl } = body;

    // validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Brand name is required' },
        { status: 400 }
      );
    }

    // check if brand already exists
    const existingBrand = await prisma.brand.findUnique({
      where: { name },
    });

    if (existingBrand) {
      return NextResponse.json(
        { error: 'Brand already exists' },
        { status: 409 }
      );
    }

    // create brand
    const brand = await prisma.brand.create({
      data: {
        name,
        logo_url: logoUrl || null,
      },
    });

    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    console.error('Error creating brand:', error);
    return NextResponse.json(
      { error: 'Failed to create brand' },
      { status: 500 }
    );
  }
}
