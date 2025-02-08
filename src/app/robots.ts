import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/favicon.ico",
          "/site.webmanifest",
          // Explicitly allow these centers
          "/anson-bay-medical-center",
          "/fomema-haemodialysis-cyberjaya",
        ],
        disallow: [
          "/api/*",
          "/_next/*",
          "/404",
          "/500",
          "/[slug]", // Disallow the dynamic route pattern
        ],
      },
    ],
    sitemap: "https://dialisis.my/sitemap.xml",
  };
}
