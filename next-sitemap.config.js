/** @type {import('next-sitemap').IConfig} */
const siteURL = process.env.SITE_URL || "https://dialisis.my";

module.exports = {
  siteUrl: siteURL,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "daily",
  priority: 0.7,
  exclude: ["/server-sitemap*", "/api/*", "/404", "/500", "/_error"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/*", "/_next/*", "/404", "/500"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/*", "/_next/*", "/404", "/500"],
      },
    ],
    additionalSitemaps: [`${siteURL}/server-sitemap.xml`],
  },
  transform: async (config, path) => {
    // Custom transform function for static pages
    const defaultPriority = config.priority;
    const defaultChangefreq = config.changefreq;

    // Increase priority for homepage
    if (path === "") {
      return {
        loc: path,
        changefreq: "daily",
        priority: 1.0,
        lastmod: new Date().toISOString(),
      };
    }

    // Increase priority for important pages
    if (path === "/peta") {
      return {
        loc: path,
        changefreq: "daily",
        priority: 0.9,
        lastmod: new Date().toISOString(),
      };
    }

    return {
      loc: path,
      changefreq: defaultChangefreq,
      priority: defaultPriority,
      lastmod: new Date().toISOString(),
    };
  },
};
