import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dialisis.my";
  const currentDate = new Date();

  // Core pages that rarely change
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/tentang-kami`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/peta`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hubungi-kami`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terma-dan-syarat`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/polisi-privasi`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  // Get all dialysis centers
  const centers = await prisma.dialysisCenter.findMany({
    select: {
      slug: true,
      updatedAt: true,
      createdAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const dynamicPages = centers.map((center) => ({
    url: `${baseUrl}/${center.slug}`,
    lastModified: center.updatedAt,
    changeFrequency: determineChangeFrequency(
      center.createdAt,
      center.updatedAt
    ),
    priority: 0.9,
  }));

  return [...staticPages, ...dynamicPages];
}

// Helper function to determine change frequency based on update patterns
function determineChangeFrequency(
  created: Date,
  updated: Date
): "daily" | "weekly" | "monthly" | "yearly" {
  const daysSinceUpdate = Math.floor(
    (Date.now() - updated.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceUpdate < 7) return "daily";
  if (daysSinceUpdate < 30) return "weekly";
  if (daysSinceUpdate < 365) return "monthly";
  return "yearly";
}
