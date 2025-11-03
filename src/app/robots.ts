import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dialisis.my";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/api/*",
          "/_next/*",
          "/404",
          "/500",
          "/undefined/*",
          "/*.json$",
          "/search?*", // Don't index search result pages
          "/*?modal=true", // Don't index modal URLs
          "/peta?*", // Don't index filtered map URLs
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap-index.xml`, // Point to index
    host: baseUrl,
  };
}
