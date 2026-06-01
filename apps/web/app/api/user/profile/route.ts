import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { auth } from '@/lib/auth';

function appendSetCookies(response: NextResponse, source: Response | undefined) {
  if (!source) {
    return;
  }

  const cookies =
    typeof source.headers.getSetCookie === 'function'
      ? source.headers.getSetCookie()
      : [];

  for (const cookie of cookies) {
    response.headers.append('set-cookie', cookie);
  }
}

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

    const passwordChangeRequested =
      currentPassword !== undefined || newPassword !== undefined;

    if (passwordChangeRequested) {
      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { error: 'Current password and new password are required' },
          { status: 400 }
        );
      }

      const changePasswordResult = (await (auth.api.changePassword as any)({
        body: {
          currentPassword,
          newPassword,
          revokeOtherSessions: false,
        },
        headers: request.headers,
        asResponse: true,
      })) as Response | undefined;

      if (changePasswordResult && !changePasswordResult.ok) {
        const errorText = await changePasswordResult.text();
        return NextResponse.json(
          { error: errorText || 'Password change failed' },
          { status: changePasswordResult.status }
        );
      }
    }

    const updateResult = (await (auth.api.updateUser as any)({
      body: {
        firstName,
        lastName,
        address,
        city,
        state,
        country,
      },
      headers: request.headers,
      asResponse: true,
    })) as Response | undefined;

    const updatedUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: updatedUser?.id,
        email: updatedUser?.email,
        firstName: updatedUser?.firstName,
        lastName: updatedUser?.lastName,
        address: updatedUser?.address,
        city: updatedUser?.city,
        state: updatedUser?.state,
        country: updatedUser?.country,
      },
    });

    appendSetCookies(response, updateResult);

    return response;
  } catch (error) {
    console.error('Profile update error:', error);
    const status =
      typeof error === 'object' && error !== null
        ? (error as { statusCode?: number; status?: number }).statusCode ??
          (error as { statusCode?: number; status?: number }).status
        : undefined;

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: status ?? 500 }
    );
  }
}
