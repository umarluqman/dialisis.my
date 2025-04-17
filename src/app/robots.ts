import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
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
        ],
      },
    ],
    sitemap: "https://dialisis.my/sitemap-index.xml", // Point to index
    host: "https://dialisis.my",
  };
}
