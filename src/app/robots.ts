import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/favicon.ico", "/site.webmanifest"],
        disallow: ["/api/*", "/_next/*", "/404", "/500"],
      },
    ],
    sitemap: "https://dialisis.my/sitemap.xml",
  };
}
