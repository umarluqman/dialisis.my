import { prisma } from "@/lib/db";
import { generateAllLocationParams } from "@/lib/location-utils";
import { posts } from "#velite";
import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dialisis.my";
const CENTERS_PER_SITEMAP = 10000;

export async function generateSitemaps() {
  try {
    const centerCount = await prisma.dialysisCenter.count();
    const sitemapCount = Math.ceil(centerCount / CENTERS_PER_SITEMAP);
    // id 0 = static + blog + locations, id 1+ = centers
    return Array.from({ length: sitemapCount + 1 }, (_, i) => ({ id: i }));
  } catch {
    // During build without DB access, return minimal sitemap
    return [{ id: 0 }];
  }
}

export default async function sitemap(props: {
  id: string;
}): Promise<MetadataRoute.Sitemap> {
  const id = Number(props.id);

  if (id === 0) {
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
      },
      {
        url: `${baseUrl}/tentang-kami`,
      },
      {
        url: `${baseUrl}/peta`,
      },
      {
        url: `${baseUrl}/hubungi-kami`,
      },
      {
        url: `${baseUrl}/terma-dan-syarat`,
      },
      {
        url: `${baseUrl}/polisi-privasi`,
      },
      {
        url: `${baseUrl}/blog`,
      },
    ];

    // Blog pages
    const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
    }));

    // Location pages
    const locationParams = generateAllLocationParams();
    const locationPages: MetadataRoute.Sitemap = locationParams.map((param) => {
      const url = param.city
        ? `${baseUrl}/lokasi/${param.state}/${param.city}`
        : `${baseUrl}/lokasi/${param.state}`;

      return {
        url,
      };
    });

    return [...staticPages, ...blogPages, ...locationPages];
  }

  // Centers for this segment (id 1+)
  const skip = (id - 1) * CENTERS_PER_SITEMAP;
  const centers = await prisma.dialysisCenter.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    skip,
    take: CENTERS_PER_SITEMAP,
  });

  return centers.map((center) => ({
    url: `${baseUrl}/${center.slug}`,
    lastModified: center.updatedAt,
  }));
}
