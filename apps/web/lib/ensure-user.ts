import { prisma } from '@repo/database';

type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
  role?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
};

export async function ensureUserRecord(sessionUser: SessionUser) {
  return prisma.user.upsert({
    where: { email: sessionUser.email },
    update: {},
    create: {
      id: sessionUser.id,
      name: sessionUser.name?.trim() || sessionUser.email,
      email: sessionUser.email,
      emailVerified: true,
      firstName: sessionUser.firstName ?? null,
      lastName: sessionUser.lastName ?? null,
      role: sessionUser.role === 'admin' ? 'admin' : 'customer',
      address: sessionUser.address ?? null,
      city: sessionUser.city ?? null,
      state: sessionUser.state ?? null,
      country: sessionUser.country ?? null,
    },
  });
}