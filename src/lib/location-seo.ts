interface LocationJsonLdProps {
  stateName: string;
  cityName?: string;
  totalCenters: number;
  url: string;
}

/**
 * Generates JSON-LD structured data for location pages
 */
export function generateLocationJsonLd({
  stateName,
  cityName,
  totalCenters,
  url,
}: LocationJsonLdProps) {
  const locationName = cityName ? `${cityName}, ${stateName}` : stateName;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    url: url,
    name: `Pusat Dialisis di ${locationName}`,
    description: `Cari pusat dialisis di ${locationName}. Terdapat ${totalCenters} pusat dialisis dengan maklumat lengkap lokasi, telefon dan perkhidmatan.`,
    inLanguage: "ms-MY",
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://dialisis.my/#website",
      url: "https://dialisis.my",
      name: "Dialisis MY",
      description: "Direktori lengkap pusat dialisis di Malaysia",
      publisher: {
        "@type": "Organization",
        "@id": "https://dialisis.my/#organization",
      },
    },
    about: {
      "@type": "MedicalBusiness",
      name: `Pusat Dialisis di ${locationName}`,
      description: `Senarai ${totalCenters} pusat dialisis di ${locationName}`,
      medicalSpecialty: "Nephrology",
      serviceType: "Dialysis Treatment",
    },
    mainEntity: {
      "@type": "ItemList",
      name: `Pusat Dialisis di ${locationName}`,
      description: `Senarai lengkap pusat dialisis di ${locationName}`,
      numberOfItems: totalCenters,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Laman Utama",
          item: "https://dialisis.my",
        },
        ...(cityName
          ? [
              {
                "@type": "ListItem",
                position: 2,
                name: stateName,
                item: `https://dialisis.my/lokasi/${stateName
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: cityName,
                item: url,
              },
            ]
          : [
              {
                "@type": "ListItem",
                position: 2,
                name: stateName,
                item: url,
              },
            ]),
      ],
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://dialisis.my/?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return jsonLd;
}

/**
 * Generates FAQ structured data for location pages
 */
export function generateLocationFaqJsonLd(
  stateName: string,
  cityName?: string
) {
  const locationName = cityName ? `${cityName}, ${stateName}` : stateName;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Berapa banyak pusat dialisis di ${locationName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Terdapat beberapa pusat dialisis di ${locationName} yang menyediakan perkhidmatan hemodialisis dan peritoneal dialisis. Sila semak senarai lengkap di laman ini untuk maklumat terkini.`,
        },
      },
      {
        "@type": "Question",
        name: `Adakah terdapat pusat dialisis MOH di ${locationName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Ya, terdapat pusat dialisis di bawah Kementerian Kesihatan Malaysia (MOH) dan juga pusat swasta di ${locationName}. Setiap pusat menyediakan perkhidmatan yang berkualiti untuk pesakit buah pinggang.`,
        },
      },
      {
        "@type": "Question",
        name: `Bagaimana untuk membuat temujanji di pusat dialisis di ${locationName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Untuk membuat temujanji, anda boleh menghubungi terus pusat dialisis melalui nombor telefon yang disediakan. Pastikan anda membawa rujukan doktor dan dokumen perubatan yang berkaitan.`,
        },
      },
    ],
  };

  return jsonLd;
}
