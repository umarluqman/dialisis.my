import { prisma } from "@/lib/prisma";
import { MetadataRoute } from "next";

// A sitemap index file is just a special type of sitemap
export default async function sitemapIndex(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dialisis.my";

  // Count total centers to determine how many sitemaps we need
  const totalCenters = await prisma.dialysisCenter.count();
  const CENTERS_PER_SITEMAP = 1000;
  const totalSitemaps = Math.ceil(totalCenters / CENTERS_PER_SITEMAP) || 1;

  // Create the sitemap index entries
  const sitemaps = [
    {
      url: `${baseUrl}/sitemap.xml`,
      lastModified: new Date(),
    },
  ];

  // Add sitemaps for centers (paginated)
  for (let i = 1; i <= totalSitemaps; i++) {
    sitemaps.push({
      url: `${baseUrl}/sitemap-centers-${i}.xml`,
      lastModified: new Date(),
    });
  }

  return sitemaps;
}
