import { config as loadEnv } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const fileDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(fileDir, "..", "..");
const rootEnvPath = resolve(rootDir, ".env");

// load environment variables from root .env
loadEnv({ path: rootEnvPath });

let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set in the .env file at the root.");
}

// resolve relative path from root directory
if (databaseUrl.startsWith("file:./")) {
  const relativePath = databaseUrl.replace("file:", "");
  const absolutePath = resolve(rootDir, relativePath);
  databaseUrl = `file:${absolutePath}`;
}

const adapter = new PrismaLibSql({ url: databaseUrl });

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

export * from "@prisma/client";
