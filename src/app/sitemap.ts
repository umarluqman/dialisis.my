import { prisma } from "@/lib/db";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dialisis.my";

  // Core pages that rarely change
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `${baseUrl}/tentang-kami`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${baseUrl}/peta`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hubungi-kami`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terma-dan-syarat`,
      lastModified: new Date(),
      priority: 0.3,
    },
    {
      url: `${baseUrl}/polisi-privasi`,
      lastModified: new Date(),
      priority: 0.3,
    },
  ];

  // Get all dialysis centers
  const centers = await prisma.dialysisCenter.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const dynamicPages = centers.map((center) => ({
    url: `${baseUrl}/${center.slug}`,
    lastModified: center.updatedAt,
    priority: 0.9,
  }));

  return [...staticPages, ...dynamicPages];
}
