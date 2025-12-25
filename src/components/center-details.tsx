import { Button } from "@/components/ui/button";
import { DialysisCenter, State } from "@prisma/client";
import { ExternalLink, Globe, Mail, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "./ui/badge";

interface Props {
  center: DialysisCenter & {
    state: Pick<State, "name">;
  };
  isModal?: boolean;
}

export function DialysisCenterDetails({ center, isModal }: Props) {
  const t = useTranslations("centerDetails");
  const tTreatments = useTranslations("common.treatments");
  const tHepatitis = useTranslations("common.hepatitis");

  // const units = center.units.split(",").filter(Boolean);
  const stateName = center.state.name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const shortAddress = center.town ? `${center.town}, ${stateName}` : stateName;

  const hepatitisArray = center.hepatitisBay
    ? center.hepatitisBay.split(", ")
    : [];
  const treatmentArray = center.units
    ? center.units.split(", ").map((unit) => ({
        name: unit,
        value: unit.toLowerCase().includes("hd unit")
          ? tTreatments("hd")
          : unit.toLowerCase().includes("tx unit")
          ? tTreatments("tx")
          : unit.toLowerCase().includes("mrrb unit")
          ? tTreatments("mrrb")
          : tTreatments("pd"),
      }))
    : [];

  return (
    <div className="">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-4xl font-bold">
          {center.dialysisCenterName}
        </h1>
        <p className="text-muted-foreground">{shortAddress}</p>
      </div>

      <div className="space-y-2 text-sm mt-12 max-w-xl">
        <p className="flex flex-col gap-2 space-y-2">
          <div className="flex-1">{center.addressWithUnit}</div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              asChild
            >
              <a
                href={`https://www.waze.com/ul?ll=${center.latitude},${center.longitude}&navigate=yes`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Waze <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  center.addressWithUnit
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Google Maps
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </p>
      </div>
      <div className="space-y-2 text-sm mt-12">
        {center.phoneNumber && (
          <p className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              <Phone className="w-4 h-4" />
              <a href={`tel:${center.phoneNumber}`} className="hover:underline">
                {center.phoneNumber}
              </a>
            </Button>
          </p>
        )}
        {center.email && (
          <p className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              <Mail className="w-4 h-4" />
              <a href={`mailto:${center.email}`} className="hover:underline">
                {center.email}
              </a>
            </Button>
          </p>
        )}
        {center.website && (
          <p className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              <Globe className="w-4 h-4" />
              <a
                href={center.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {t("website")}
              </a>
            </Button>
          </p>
        )}
      </div>

      <div className="mt-12">
        <h2 className="font-semibold">{t("medicalStaff")}</h2>
        <div className="space-y-4 text-sm mt-4">
          <p className="flex flex-col gap-1">
            <span className="font-medium text-zinc-500">
              {t("doctorOnDuty")}
            </span>{" "}
            {center.drInCharge}
            {center.drInChargeTel && (
              <p className="flex items-center gap-2">
                <Button variant="secondary" size="sm" className="mb-4 mt-2">
                  <Phone className="w-4 h-4" />
                  <a
                    href={`tel:${center.drInChargeTel}`}
                    className="hover:underline"
                  >
                    {center.drInChargeTel}
                  </a>
                </Button>
              </p>
            )}
          </p>
          {center.panelNephrologist && (
            <p className="flex flex-col gap-1">
              <span className="font-medium text-zinc-500">
                {t("nephrology")}
              </span>{" "}
              {center.panelNephrologist}
            </p>
          )}
          {center.centreManager && (
            <p className="flex flex-col gap-1">
              <span className="font-medium text-zinc-500">
                {t("management")}
              </span>{" "}
              {center.centreManager}
            </p>
          )}
          {center.centreCoordinator && (
            <p className="flex flex-col gap-1">
              <span className="font-medium text-zinc-500">
                {t("coordinator")}
              </span>{" "}
              {center.centreCoordinator}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 my-2 mt-12">
        <h2 className="font-semibold">{t("services")}</h2>
        <div className="flex flex-wrap gap-2">
          {treatmentArray.map((treatment) => (
            <Badge
              key={treatment.name}
              className="bg-[#a3bdffff]/20 text-[#375092ff] hover:bg-[#a3bdffff]/50 shadow-none font-normal text-base"
            >
              {treatment.value}
            </Badge>
          ))}{" "}
        </div>
      </div>

      <div className="flex flex-wrap mb-4">
        {hepatitisArray.length > 0 ? (
          <div className="flex items-center gap-2">
            {hepatitisArray.map((hep) => (
              <Badge
                key={hep}
                className="bg-amber-100 text-base text-amber-800 shadow-none hover:bg-amber-200 font-normal"
              >
                {hep.toLowerCase().includes("hep b")
                  ? tHepatitis("b")
                  : hep.toLowerCase().includes("hep c")
                  ? tHepatitis("c")
                  : tHepatitis("none")}
              </Badge>
            ))}
            {/* <PopiconsCircleInfoLine className="cursor-pointer w-4 h-4 text-zinc-500" /> */}
          </div>
        ) : null}
      </div>

      {/* <div className="space-y-4">
          {center.latitude && center.longitude && (
            <div className="h-[300px] rounded-lg overflow-hidden">
              <MapView
                center={[center.latitude, center.longitude]}
                zoom={15}
                markers={[
                  {
                    position: [center.latitude, center.longitude],
                    popup: center.dialysisCenterName,
                  },
                ]}
              />
            </div>
          )}
        </div> */}

      {/* {isModal && (
        <div className="flex justify-end">
          <Button asChild>
            <Link href={`/dialysis-center/${center.id}`}>
              View Full Details
            </Link>
          </Button>
        </div>
      )} */}
    </div>
  );
}
