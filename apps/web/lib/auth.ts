import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@repo/database";
import { hashPassword, verifyPassword } from "./hashing";

// Validate environment variables
if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error('BETTER_AUTH_SECRET environment variable is required');
}

if (!process.env.BETTER_AUTH_URL) {
  throw new Error('BETTER_AUTH_URL environment variable is required');
}

if (process.env.BETTER_AUTH_SECRET.length < 32) {
  console.warn('BETTER_AUTH_SECRET should be at least 32 characters long');
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  basePath: "/api/auth",
  baseURL: process.env.BETTER_AUTH_URL,
  advanced: {
    useSecureCookies: process.env.NODE_ENV === 'production',
    crossSubDomainCookies: false,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
      },
      firstName: {
        type: "string",
        required: false,
      },
      lastName: {
        type: "string",
        required: false,
      },
      address: {
        type: "string",
        required: false,
      },
      city: {
        type: "string",
        required: false,
      },
      state: {
        type: "string",
        required: false,
      },
      country: {
        type: "string",
        required: false,
      },
      preferredMode: {
        type: "string",
        required: false,
        defaultValue: "dark",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 1, // 1 day
    updateAge: 60 * 60 * 24, // update session age every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // cache for 5 minutes
    },
  },
  trustHost: true,
});
