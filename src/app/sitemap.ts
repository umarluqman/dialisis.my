import { prisma } from "@/lib/db";
import { generateAllLocationParams } from "@/lib/location-utils";
import { allPosts } from "contentlayer/generated";
import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dialisis.my";
const CENTERS_PER_SITEMAP = 10000;

export async function generateSitemaps() {
  const centerCount = await prisma.dialysisCenter.count();
  const sitemapCount = Math.ceil(centerCount / CENTERS_PER_SITEMAP);
  // id 0 = static + blog + locations, id 1+ = centers
  return Array.from({ length: sitemapCount + 1 }, (_, i) => ({ id: i }));
}

export default async function sitemap(props: {
  id: string;
}): Promise<MetadataRoute.Sitemap> {
  const id = Number(props.id);
  const currentDate = new Date();

  if (id === 0) {
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 1,
      },
      {
        url: `${baseUrl}/tentang-kami`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: `${baseUrl}/peta`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        url: `${baseUrl}/hubungi-kami`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/terma-dan-syarat`,
        lastModified: currentDate,
        changeFrequency: "yearly",
        priority: 0.3,
      },
      {
        url: `${baseUrl}/polisi-privasi`,
        lastModified: currentDate,
        changeFrequency: "yearly",
        priority: 0.3,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.8,
      },
    ];

    // Blog pages
    const blogPages: MetadataRoute.Sitemap = allPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly",
      priority: post.featured ? 0.8 : 0.6,
    }));

    // Location pages
    const locationParams = generateAllLocationParams();
    const locationPages: MetadataRoute.Sitemap = locationParams.map((param) => {
      const url = param.city
        ? `${baseUrl}/lokasi/${param.state}/${param.city}`
        : `${baseUrl}/lokasi/${param.state}`;

      return {
        url,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: param.city ? 0.7 : 0.8,
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
      createdAt: true,
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
    changeFrequency: determineChangeFrequency(center.createdAt, center.updatedAt),
    priority: 0.9,
  }));
}

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
