import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Number of centers per sitemap
const CENTERS_PER_SITEMAP = 1000;

export async function GET(
  request: NextRequest,
  { params }: { params: { num: string } }
) {
  try {
    const pageNum = parseInt(params.num, 10);

    if (isNaN(pageNum) || pageNum < 1) {
      return new NextResponse("Invalid sitemap number", { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dialisis.my";

    // Calculate pagination
    const skip = (pageNum - 1) * CENTERS_PER_SITEMAP;

    // Get centers for this page
    const centers = await prisma.dialysisCenter.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip: skip,
      take: CENTERS_PER_SITEMAP,
    });

    // Generate sitemap XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${centers
    .map(
      (center) => `
  <url>
    <loc>${baseUrl}/${center.slug}</loc>
    <lastmod>${center.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  `
    )
    .join("")}
</urlset>`;

    // Return XML with proper content type
    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800", // Cache for a day
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}
