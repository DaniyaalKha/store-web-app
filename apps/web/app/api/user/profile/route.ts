import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { auth } from '@/lib/auth';
import { verifyPassword, hashPassword } from '@/lib/hashing';

export async function PUT(request: NextRequest) {
  try {
    // get session
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      address,
      city,
      state,
      country,
      currentPassword,
      newPassword,
    } = body;

    // validate required fields
    if (!firstName || !lastName || !address || !city || !state || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // verify current password
    if (currentPassword && newPassword) {
      const userAccount = await prisma.account.findFirst({
        where: { userId: session.user.id },
      });

      if (!userAccount || !userAccount.password) {
        return NextResponse.json(
          { error: 'User account not found or has no password' },
          { status: 400 }
        );
      }

      const isPasswordValid = await verifyPassword(
        currentPassword,
        userAccount.password
      );

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      // update new password
      const hashedPassword = await hashPassword(newPassword);
      await prisma.account.update({
        where: { id: userAccount.id },
        data: { password: hashedPassword },
      });
    }

    // update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName,
        lastName,
        address,
        city,
        state,
        country,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        address: updatedUser.address,
        city: updatedUser.city,
        state: updatedUser.state,
        country: updatedUser.country,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
