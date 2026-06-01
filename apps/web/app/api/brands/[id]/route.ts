import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { auth } from '@/lib/auth';

// PUT update brand
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const brandId = parseInt(params.id);
    const body = await request.json();
    const { name, logoUrl } = body;

    // validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Brand name is required' },
        { status: 400 }
      );
    }

    // check if brand exists
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    // check if brand name exists
    if (name !== brand.name) {
      const existingBrand = await prisma.brand.findUnique({
        where: { name },
      });

      if (existingBrand) {
        return NextResponse.json(
          { error: 'Brand name already exists' },
          { status: 409 }
        );
      }
    }

    // update brand
    const updatedBrand = await prisma.brand.update({
      where: { id: brandId },
      data: {
        name,
        logo_url: logoUrl || null,
      },
    });

    return NextResponse.json(updatedBrand);
  } catch (error) {
    console.error('Error updating brand:', error);
    return NextResponse.json(
      { error: 'Failed to update brand' },
      { status: 500 }
    );
  }
}

// DELETE brand
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const brandId = parseInt(params.id);

    // check if brand exists
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      include: { products: true },
    });

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    // check if brand has products
    if (brand.products.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete brand that has products' },
        { status: 400 }
      );
    }

    // delete brand
    await prisma.brand.delete({
      where: { id: brandId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting brand:', error);
    return NextResponse.json(
      { error: 'Failed to delete brand' },
      { status: 500 }
    );
  }
}
