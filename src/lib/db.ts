import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  if (!process.env.TURSO_DATABASE_URL) {
    throw new Error("TURSO_DATABASE_URL environment variable is not set");
  }
  if (!process.env.TURSO_AUTH_TOKEN) {
    throw new Error("TURSO_AUTH_TOKEN environment variable is not set");
  }

  const adapter = new PrismaLibSql({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  return new PrismaClient({ adapter });
}

export function getPrisma() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

// For backwards compatibility - lazy getter
export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    return getPrisma()[prop as keyof PrismaClient];
  },
});
