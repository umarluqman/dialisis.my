import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

const CENTERS_PER_SITEMAP = 10000;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dialisis.my";
  const now = new Date().toISOString();
  let centerCount = 0;

  try {
    centerCount = await prisma.dialysisCenter.count();
  } catch {}

  const dynamicSitemapCount = Math.ceil(centerCount / CENTERS_PER_SITEMAP);
  const ids = [
    0,
    ...Array.from({ length: dynamicSitemapCount }, (_, index) => index + 1),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ids
  .map(
    (id) => `  <sitemap>
    <loc>${baseUrl}/sitemap/${id}.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`
  )
  .join("\n")}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
