import { config as loadEnv } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const fileDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(fileDir, "..", "..");
const rootEnvPath = resolve(rootDir, ".env");

// load environment variables from root .env
loadEnv({ path: rootEnvPath });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set in the .env file at the root.");
}

const pool = new Pool({
  connectionString: databaseUrl,
});
const adapter = new PrismaPg(pool);

// create Prisma Client instance
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Explicitly export Prisma types and enums
export type {
  User,
  Brand,
  Category,
  Product,
  Order,
  OrderProduct,
  Cart,
  CartItem,
} from "@prisma/client";

export {
  UserRole,
  OrderStatus,
  CategoryName,
  Prisma,
} from "@prisma/client";
