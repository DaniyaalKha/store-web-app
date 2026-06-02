import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@repo/database';

export async function PUT(request: Request) {
  try {
    // Get the session from better-auth
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { preferredMode } = await request.json();

    if (!preferredMode || (preferredMode !== 'light' && preferredMode !== 'dark')) {
      return Response.json(
        { error: 'Invalid theme mode' },
        { status: 400 }
      );
    }

    // Update user's preferred theme
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { preferredMode },
      select: {
        id: true,
        preferredMode: true,
      },
    });

    return Response.json({ success: true, preferredMode: updatedUser.preferredMode });
  } catch (error) {
    console.error('Error updating theme preference:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
