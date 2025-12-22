export const jsonLdHome = {
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  name: "Dialisis MY | Cari Pusat Dialisis di Malaysia",
  description:
    "Cari lebih daripada 900 pusat dialisis di seluruh Malaysia. Maklumat lengkap tentang lokasi, info kontak, doktor bertugas, sektor, dan perkhidmatan dialisis.",
  about: {
    "@type": "MedicalBusiness",
    name: "Dialysis Centers Directory Malaysia",
    medicalSpecialty: "Nephrology",
  },
  audience: {
    "@type": "MedicalAudience",
    audienceType: "Patients",
  },
  provider: {
    "@type": "Organization",
    name: "Dialisis MY",
    url: "https://dialisis.my",
  },
  offers: {
    "@type": "Service",
    serviceType: "Medical Directory Service",
    availableService: [
      "Hemodialysis",
      "Peritoneal Dialysis",
      "Transplant Services",
      "MRRB Services",
    ],
  },
};

// JSON-LD data
export const jsonLdMap = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Peta Pusat Dialisis di Malaysia",
  description: "Peta interaktif pusat dialisis di Malaysia",
  publisher: {
    "@type": "Organization",
    name: "Dialisis MY",
    url: "https://dialisis.my",
  },
  mainEntity: {
    "@type": "Map",
    name: "Peta Pusat Dialisis di Malaysia",
    description:
      "Peta interaktif yang menunjukkan lokasi pusat-pusat dialisis di seluruh Malaysia",
    about: {
      "@type": "MedicalBusiness",
      name: "Pusat Dialisis Malaysia",
      "@id": "https://dialisis.my/peta",
      medicalSpecialty: "Nephrology",
    },
  },
};

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  image?: string;
  author?: string;
  locale?: string;
  category?: string;
  tags?: string[];
  body: { raw: string };
}

export function generateArticleJsonLd(post: BlogPost, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${baseUrl}/blog/${post.slug}`,
    headline: post.title,
    description: post.description,
    image: post.image || `${baseUrl}/og-image.png`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: post.author || "Dialisis MY",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Dialisis MY",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug}`,
    },
    inLanguage: post.locale === "en" ? "en-MY" : "ms-MY",
    articleSection: post.category || "Kesihatan",
    keywords: post.tags?.join(", "),
    wordCount: post.body.raw.split(/\s+/).length,
  };
}

export function generateBlogListJsonLd(baseUrl: string, locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${baseUrl}/blog`,
    name: locale === "en" ? "Dialisis MY Blog" : "Blog Dialisis MY",
    description:
      locale === "en"
        ? "Health articles about dialysis and kidney care in Malaysia"
        : "Artikel kesihatan tentang dialisis dan penjagaan buah pinggang di Malaysia",
    url: `${baseUrl}/blog`,
    publisher: {
      "@type": "Organization",
      name: "Dialisis MY",
      url: baseUrl,
    },
    inLanguage: locale === "en" ? "en-MY" : "ms-MY",
  };
}
