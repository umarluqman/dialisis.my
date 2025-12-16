import { prisma } from "./db";

export async function getAllCenters() {
  const centers = await prisma.dialysisCenter.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  return centers.map((center) => ({
    ...center,
    updatedAt: center.updatedAt.toISOString(),
  }));
}
