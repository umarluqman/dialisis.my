import { BackButton } from "@/components/back-button";
import { DialysisCenterDetails } from "@/components/center-details";
import { EnhancedDialysisCenterDetails } from "@/components/enhanced-center-details";
import { prisma } from "@/lib/db";
import { DialysisCenter, State } from "@prisma/client";
import { notFound } from "next/navigation";

interface Props {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

type CenterWithState = {
  featured: boolean;
} & DialysisCenter & {
    state: Pick<State, "name">;
  };

async function getCenter(slug: string): Promise<CenterWithState | null> {
  const center = await prisma.dialysisCenter.findUnique({
    where: { slug },
    include: {
      state: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!center) return null;

  return center as CenterWithState;
}

function generateJsonLd(center: CenterWithState): any {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": `https://dialisis.my/${center.slug}`,
    name: center.dialysisCenterName,
    description: `Pusat dialisis ${center.dialysisCenterName} di ${center.town}, ${center.state.name}. Menyediakan perkhidmatan ${center.units}.`,
    url: `https://dialisis.my/${center.slug}`,
    telephone: center.phoneNumber || center.tel,
    email: center.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: center.addressWithUnit || center.address,
      addressLocality: center.town,
      addressRegion: center.state.name,
      addressCountry: "MY",
    },
    geo:
      center.latitude && center.longitude
        ? {
            "@type": "GeoCoordinates",
            latitude: center.latitude,
            longitude: center.longitude,
          }
        : undefined,
    medicalSpecialty: ["Nephrology", "Dialysis"],
    availableService: center.units?.split(",").map((unit: string) => ({
      "@type": "MedicalProcedure",
      name: unit.trim(),
      procedureType: unit.toLowerCase().includes("hd")
        ? "Hemodialysis"
        : unit.toLowerCase().includes("pd")
        ? "Peritoneal Dialysis"
        : "Dialysis Treatment",
    })),
    healthcareType: [
      center.sector === "MOH"
        ? "Public Hospital Department"
        : center.sector === "NGO"
        ? "Nonprofit Organization"
        : "Private Medical Center",
    ],
    medicalConditionsTreated: [
      "Chronic Kidney Disease",
      "End-Stage Renal Disease",
      "Kidney Failure",
    ],
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Hepatitis Treatment",
        value: center.hepatitisBay || "Not Available",
      },
      {
        "@type": "PropertyValue",
        name: "Sector",
        value: center.sector,
      },
    ],
    // Enhanced structured data
    // openingHours: center.operatingHours || "Mo-Fr 08:00-17:00",
    // priceRange: "$$",
    sameAs: center.website ? [center.website] : undefined,
    hasMap:
      center.latitude && center.longitude
        ? `https://www.google.com/maps?q=${center.latitude},${center.longitude}`
        : undefined,
  };
}

function generateFAQJsonLd(center: CenterWithState): any {
  const faqItems = [
    {
      question: "Apakah jenis rawatan dialisis yang disediakan?",
      answer: `${center.dialysisCenterName} menyediakan perkhidmatan hemodialisis (HD) berkualiti tinggi dengan menggunakan peralatan moden dan teknologi terkini. Kami juga menawarkan rawatan untuk pesakit Hepatitis B dan C di ruang khas yang berasingan untuk memastikan keselamatan semua pesakit.`,
    },
    {
      question: "Berapa kos rawatan dialisis di pusat ini?",
      answer: "Kos rawatan bergantung kepada jenis rawatan dan keperluan pesakit. Kami menerima pembayaran melalui panel insurans, SOCSO, dan pembayaran sendiri. Sila hubungi kami untuk maklumat terperinci mengenai pakej rawatan dan kaedah pembayaran yang tersedia.",
    },
    {
      question: "Bagaimana untuk membuat temujanji rawatan?",
      answer: `Untuk membuat temujanji, anda boleh menghubungi kami di ${center.phoneNumber || center.tel || "nombor telefon kami"} atau datang terus ke pusat kami. Pasukan kami akan membantu mengatur jadual rawatan yang sesuai dengan keperluan anda.`,
    },
    {
      question: "Apakah waktu operasi pusat dialisis ini?",
      answer: "Pusat kami beroperasi dari Isnin hingga Sabtu dengan tiga sesi harian: Sesi Pagi (7:00 pagi - 12:00 tengahari), Sesi Tengahari (12:30 - 5:30 petang), dan Sesi Malam (6:00 - 11:00 malam).",
    },
    {
      question: "Adakah pusat ini menerima pesakit baru?",
      answer: `Ya, ${center.dialysisCenterName} menerima pesakit baru. Pesakit perlu membawa surat rujukan dari doktor, laporan perubatan terkini, dan dokumen berkaitan.`,
    },
    {
      question: "Apakah kemudahan yang disediakan untuk pesakit?",
      answer: `Kami menyediakan ruang rawatan yang selesa dengan penghawa dingin, katil yang boleh dilaras, TV untuk hiburan, dan makanan ringan. Terdapat juga kemudahan parkir yang mencukupi untuk pesakit dan pelawat di ${center.town}.`,
    },
    {
      question: "Bolehkah keluarga menemani semasa rawatan?",
      answer: "Ya, ahli keluarga dibenarkan menemani pesakit semasa rawatan. Kami menyediakan kerusi untuk peneman di sebelah setiap katil rawatan.",
    },
    {
      question: "Adakah pusat ini mempunyai doktor pakar?",
      answer: "Pusat kami mempunyai doktor bertugas yang berpengalaman dan pakar nefrologi panel yang membuat lawatan berkala.",
    },
    {
      question: "Apakah langkah keselamatan COVID-19 yang diambil?",
      answer: "Kami mengamalkan SOP ketat termasuk pemeriksaan suhu, pemakaian pelitup muka, penjarakan sosial, dan sanitasi berkala.",
    },
    {
      question: "Bagaimana untuk mendapatkan bantuan kewangan untuk rawatan?",
      answer: "Terdapat beberapa pilihan bantuan kewangan termasuk Skim Bantuan Dialisis Kerajaan, bantuan Zakat, SOCSO, dan NGO. Pasukan kami boleh membantu anda memohon bantuan yang sesuai.",
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export const generateMetadata = async ({ params }: Props) => {
  const center = await getCenter(params.slug);

  if (!center) {
    return {
      title: "Not Found",
      description: "The page you're looking for doesn't exist.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalUrl = `https://dialisis.my/${params.slug}`;

  // Optimize town/state names for better SEO
  const location = `${center.town}, ${center.state.name}`;

  // Get service types for more descriptive metadata
  const services = center.units
    ? center.units.toLowerCase().includes("hd") &&
      center.units.toLowerCase().includes("pd")
      ? "Hemodialisis dan Peritoneal Dialisis"
      : center.units.toLowerCase().includes("hd")
      ? "Hemodialisis"
      : center.units.toLowerCase().includes("pd")
      ? "Peritoneal Dialisis"
      : "Perkhidmatan Dialisis"
    : "Perkhidmatan Dialisis";

  return {
    title: `${center.dialysisCenterName} - Pusat Dialisis di ${location}`,
    description: `Pusat dialisis ${
      center.dialysisCenterName
    } di ${location}. Menyediakan ${services} untuk pesakit buah pinggang. ${
      center.sector === "MOH"
        ? "Hospital kerajaan"
        : center.sector === "NGO"
        ? "Pusat NGO"
        : "Pusat swasta"
    }.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      url: canonicalUrl,
      title: `${center.dialysisCenterName} - Pusat Dialisis di ${location}`,
      description: `Pusat dialisis ${center.dialysisCenterName} di ${location}. Menyediakan ${services} untuk pesakit buah pinggang.`,
      siteName: "Dialisis MY",
      locale: "ms_MY",
      type: "article",
      images: [
        {
          url: "https://dialisis.my/og-image.png",
          width: 1200,
          height: 630,
          alt: `Pusat Dialisis ${center.dialysisCenterName} di ${location}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${center.dialysisCenterName} - Pusat Dialisis di ${location}`,
      description: `Pusat dialisis di ${location}. Menyediakan ${services}.`,
      images: ["/og-image.png"],
    },
  };
};

// Add static generation for better performance and SEO
export async function generateStaticParams() {
  // Get all centers for static generation
  const centers = await prisma.dialysisCenter.findMany({
    select: {
      slug: true,
    },
  });

  return centers.map((center) => ({
    slug: center.slug,
  }));
}

export default async function DialysisCenterPage({
  params,
  searchParams,
}: Props) {
  const center = await getCenter(params.slug);

  if (!center) {
    notFound();
  }

  const jsonLd = generateJsonLd(center);
  const isFeatured = !!center?.featured;
  const faqJsonLd = isFeatured ? generateFAQJsonLd(center) : null;

  // Format location for breadcrumbs structured data
  const locationParts = [
    { name: "Dialisis MY", item: "https://dialisis.my" },
    {
      name: center.state.name,
      item: `https://dialisis.my/peta?state=${encodeURIComponent(
        center.state.name
      )}`,
    },
    {
      name: center.town,
      item: `https://dialisis.my/peta?town=${encodeURIComponent(center.town)}`,
    },
    {
      name: center.dialysisCenterName,
      item: `https://dialisis.my/${center.slug}`,
    },
  ];

  // Create breadcrumbs structured data
  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: locationParts.map((part, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: part.name,
      item: part.item,
    })),
  };

  return (
    <main className="w-full mb-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      {isFeatured ? (
        <EnhancedDialysisCenterDetails center={center} />
      ) : (
        <>
          <nav className="container mt-4 flex items-center gap-3 text-xs md:text-sm text-muted-foreground">
            <BackButton />
            <span>/</span>
            <span className="text-foreground">
              {center.dialysisCenterName.split(",")[0]}
            </span>
          </nav>
          <div className="container max-w-5xl py-6">
            <DialysisCenterDetails center={center} />
          </div>
        </>
      )}
    </main>
  );
}
