import { getAllCenters } from "@/lib/centers";
import { getServerSideSitemap } from "next-sitemap";
import { ISitemapField } from "next-sitemap/dist/@types/interface";

export async function GET() {
  const centers = await getAllCenters();
  const siteURL = process.env.SITE_URL || "https://dialisis.my";

  const centerPaths: ISitemapField[] = centers.map((center) => ({
    loc: `${siteURL}/${center.slug}`,
    lastmod: center.updatedAt || new Date().toISOString(),
    changefreq: "weekly" as const,
    priority: 0.8,
  }));

  const staticPaths: ISitemapField[] = [
    {
      loc: siteURL,
      lastmod: new Date().toISOString(),
      changefreq: "daily" as const,
      priority: 1.0,
    },
    {
      loc: `${siteURL}/peta`,
      lastmod: new Date().toISOString(),
      changefreq: "daily" as const,
      priority: 0.9,
    },
  ];

  return getServerSideSitemap([...staticPaths, ...centerPaths]);
}
