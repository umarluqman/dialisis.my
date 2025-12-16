import { Metadata } from "next";

interface GenerateMetadataProps {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
}

export function generateMetadata({
  title,
  description,
  image,
  noIndex,
  canonicalUrl,
}: GenerateMetadataProps): Metadata {
  const siteURL = process.env.SITE_URL || "https://dialisis.my";

  const metadata: Metadata = {
    title: title
      ? `${title} | Dialisis.my`
      : "Dialisis.my - Pusat Dialisis di Malaysia",
    description:
      description ||
      "Cari pusat dialisis terdekat di Malaysia. Informasi lengkap mengenai rawatan dialisis dan pusat hemodialisis.",
    openGraph: {
      title: title
        ? `${title} | Dialisis.my`
        : "Dialisis.my - Pusat Dialisis di Malaysia",
      description:
        description ||
        "Cari pusat dialisis terdekat di Malaysia. Informasi lengkap mengenai rawatan dialisis dan pusat hemodialisis.",
      url: canonicalUrl || siteURL,
      siteName: "Dialisis.my",
      images: [
        {
          url: image || `${siteURL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title || "Dialisis.my",
        },
      ],
      locale: "ms_MY",
      type: "website",
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
    twitter: {
      card: "summary_large_image",
      title: title
        ? `${title} | Dialisis.my`
        : "Dialisis.my - Pusat Dialisis di Malaysia",
      description:
        description ||
        "Cari pusat dialisis terdekat di Malaysia. Informasi lengkap mengenai rawatan dialisis dan pusat hemodialisis.",
      images: [image || `${siteURL}/og-image.jpg`],
    },
    ...(canonicalUrl && {
      alternates: {
        canonical: canonicalUrl,
      },
    }),
  };

  return metadata;
}
