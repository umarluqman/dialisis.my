import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function maskUrl(url: string | undefined) {
  if (!url) return "<unset>";
  return url.replace(/(authToken=)[^&]+/i, "$1***");
}

function maskToken(token: string | undefined) {
  if (!token) return "<unset>";
  return `${token.slice(0, 8)}…${token.slice(-4)} (len=${token.length})`;
}

function createPrismaClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  console.log("[db] init prisma client", {
    NODE_ENV: process.env.NODE_ENV,
    TURSO_DATABASE_URL: maskUrl(tursoUrl),
    TURSO_AUTH_TOKEN: maskToken(tursoToken),
    DATABASE_URL: maskUrl(process.env.DATABASE_URL),
  });

  if (!tursoUrl) {
    throw new Error("TURSO_DATABASE_URL environment variable is not set");
  }
  if (!tursoToken) {
    throw new Error("TURSO_AUTH_TOKEN environment variable is not set");
  }

  const adapter = new PrismaLibSql({
    url: tursoUrl,
    authToken: tursoToken,
  });
  console.log("[db] prisma client created against", maskUrl(tursoUrl));
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
