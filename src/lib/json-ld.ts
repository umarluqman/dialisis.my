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
  name: "Peta Pusat Dialisis Malaysia",
  description: "Peta interaktif pusat dialisis di Malaysia",
  publisher: {
    "@type": "Organization",
    name: "Dialisis MY",
    url: "https://dialisis.my",
  },
  mainEntity: {
    "@type": "Map",
    name: "Peta Pusat Dialisis Malaysia",
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
