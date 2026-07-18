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
        urlTemplate: "https://dialisis.my/?name={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return jsonLd;
}

