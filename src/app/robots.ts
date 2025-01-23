import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/*", "/_next/*", "/404", "/500"],
    },
    sitemap: "https://dialisis.my/sitemap.xml",
  };
}
