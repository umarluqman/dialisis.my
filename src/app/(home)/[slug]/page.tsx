import { DialysisCenterDetails } from "@/components/center-details";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

async function getCenter(slug: string) {
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

  return {
    ...center,
    state: {
      ...center.state,
      name: center.state.name.replace(/-/g, " "),
    },
  };
}

function generateJsonLd(center: any): any {
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
  };
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

  return (
    <main className="w-full mb-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="container mt-4 flex items-center gap-3 text-xs md:text-sm text-muted-foreground">
        <Link
          href={{
            pathname: "/",
            search: new URLSearchParams(
              searchParams as Record<string, string>
            ).toString(),
          }}
          className="hover:text-foreground transition-colors"
        >
          <Button variant="outline" size={"sm"}>
            <ChevronLeft className="w-4 h-4" /> Senarai
          </Button>
        </Link>
        <span>/</span>
        <span className="text-foreground">
          {center.dialysisCenterName.split(",")[0]}
        </span>
      </nav>
      <div className="container max-w-5xl py-6">
        <DialysisCenterDetails center={center} />
      </div>
    </main>
  );
}
