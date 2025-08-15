import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FAQSection } from "@/components/faq-section";
import {
  PopiconsGlobeDuotone,
  PopiconsMailDuotone,
  PopiconsPhoneDuotone,
  PopiconsLocationDuotone,
  PopiconsUserDuotone,
} from "@popicons/react";
import Link from "next/link";

export const runtime = "edge";

interface PageProps {
  params: {
    state: string;
    city: string;
    name: string;
  };
}

async function getDialysisCenter(state: string, city: string, name: string) {
  const decodedName = decodeURIComponent(name);
  const decodedCity = decodeURIComponent(city);
  const decodedState = decodeURIComponent(state);

  const center = await prisma.dialysisCenter.findFirst({
    where: {
      dialysisCenterName: decodedName,
      town: decodedCity,
      state: {
        name: decodedState,
      },
    },
    include: {
      state: true,
    },
  });

  return center;
}

async function getFeaturedFAQs() {
  const faqs = await prisma.fAQ.findMany({
    where: {
      featured: true,
    },
    orderBy: {
      order: "asc",
    },
  });

  return faqs;
}

export default async function DialysisCenterDetailPage({ params }: PageProps) {
  const [center, faqs] = await Promise.all([
    getDialysisCenter(params.state, params.city, params.name),
    getFeaturedFAQs(),
  ]);

  if (!center) {
    notFound();
  }

  const unitsArray = center.units ? center.units.split(",") : [];
  const title = center.dialysisCenterName.split(",")[0];
  const hepatitisArray = center.hepatitisBay
    ? center.hepatitisBay.split(", ")
    : [];
  const treatmentArray = unitsArray.map((unit) => ({
    name: unit,
    value: unit.toLowerCase().includes("hd unit")
      ? "Hemodialysis"
      : unit.toLowerCase().includes("tx unit")
      ? "Transplant"
      : unit.toLowerCase().includes("mrrb unit")
      ? "MRRB"
      : "Peritoneal Dialysis",
  }));

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Main Center Information Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{title}</CardTitle>
          <p className="text-lg text-muted-foreground capitalize">
            {center.town}, {center.state.name}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sector and Treatment Types */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Sector:</span>
              <span className="capitalize">
                {center.sector === "MOH" || center.sector === "NGO"
                  ? center.sector
                  : center.sector?.toLowerCase() ?? ""}
              </span>
            </div>

            <div className="space-y-2">
              <span className="font-semibold">Available Treatments:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {treatmentArray.map((treatment) => (
                  <Badge
                    key={treatment.name}
                    className="bg-blue-50 text-blue-800"
                  >
                    {treatment.value}
                  </Badge>
                ))}
              </div>
            </div>

            {hepatitisArray.length > 0 && (
              <div className="space-y-2">
                <span className="font-semibold">Hepatitis Bay:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {hepatitisArray.map((bay) => (
                    <Badge key={bay} className="bg-yellow-50 text-yellow-800">
                      {bay}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-lg">Contact Information</h3>

            {center.address && (
              <div className="flex gap-3 items-start">
                <PopiconsLocationDuotone className="w-5 h-5 stroke-[#2bde80ff] mt-1 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-primary">{center.address}</p>
                  {center.addressWithUnit && center.addressWithUnit !== center.address && (
                    <p className="text-sm text-muted-foreground">
                      {center.addressWithUnit}
                    </p>
                  )}
                </div>
              </div>
            )}

            {center.tel && (
              <div className="flex gap-3 items-center">
                <PopiconsPhoneDuotone className="w-5 h-5 stroke-[#2bde80ff]" />
                <p className="text-primary">{center.tel}</p>
              </div>
            )}

            {center.fax && (
              <div className="flex gap-3 items-center">
                <PopiconsPhoneDuotone className="w-5 h-5 stroke-[#2bde80ff]" />
                <p className="text-primary">Fax: {center.fax}</p>
              </div>
            )}

            {center.email && (
              <div className="flex gap-3 items-center">
                <PopiconsMailDuotone className="w-5 h-5 stroke-[#2bde80ff]" />
                <p className="text-primary">{center.email}</p>
              </div>
            )}

            {center.website && (
              <div className="flex gap-3 items-center">
                <PopiconsGlobeDuotone className="w-5 h-5 stroke-[#2bde80ff] text-[#012f54ff] fill-[#012f54ff]" />
                <Link
                  href={center.website.split("?")[0] + "?ref=dialysis-my"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {center.website.split("?")[0]}
                </Link>
              </div>
            )}
          </div>

          {/* Staff Information */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-lg">Staff Information</h3>

            {center.drInCharge && (
              <div className="flex gap-3 items-center">
                <PopiconsUserDuotone className="w-5 h-5 stroke-[#2bde80ff]" />
                <div>
                  <span className="font-medium">Doctor in Charge:</span>{" "}
                  {center.drInCharge}
                </div>
              </div>
            )}

            {center.panelNephrologist && (
              <div className="flex gap-3 items-center">
                <PopiconsUserDuotone className="w-5 h-5 stroke-[#2bde80ff]" />
                <div>
                  <span className="font-medium">Panel Nephrologist:</span>{" "}
                  {center.panelNephrologist}
                </div>
              </div>
            )}

            {center.centreManager && (
              <div className="flex gap-3 items-center">
                <PopiconsUserDuotone className="w-5 h-5 stroke-[#2bde80ff]" />
                <div>
                  <span className="font-medium">Centre Manager:</span>{" "}
                  {center.centreManager}
                </div>
              </div>
            )}

            {center.centreCoordinator && (
              <div className="flex gap-3 items-center">
                <PopiconsUserDuotone className="w-5 h-5 stroke-[#2bde80ff]" />
                <div>
                  <span className="font-medium">Centre Coordinator:</span>{" "}
                  {center.centreCoordinator}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section at the bottom */}
      <FAQSection faqs={faqs} />
    </div>
  );
}