import { useTranslations } from "next-intl";

interface LocationSeoContentProps {
  stateName: string;
  cityName?: string;
  stats: {
    totalCenters: number;
    mohCenters: number;
    privateCenters: number;
    hemodialysisCenters: number;
    peritonealCenters: number;
    hepatitisBCenters: number;
  };
}

export function LocationSeoContent({
  stateName,
  cityName,
  stats,
}: LocationSeoContentProps) {
  const t = useTranslations("location.seo");
  const locationName = cityName ? cityName : stateName;
  const fullLocationName = cityName ? `${cityName}, ${stateName}` : stateName;
  const hasCenters = stats.totalCenters > 0;

  return (
    <div className="mt-12 prose max-w-none">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {t("title", { location: locationName })}
      </h2>
      <div className="text-gray-600 space-y-4">
        {hasCenters ? (
          <>
            <p>
              {t("overview", {
                locationName: fullLocationName,
                totalCenters: stats.totalCenters,
                moh: stats.mohCenters,
                private: stats.privateCenters,
              })}
            </p>
            <p>
              {t("services", {
                hemodialysisCenters: stats.hemodialysisCenters,
                peritonealCenters: stats.peritonealCenters,
                hepatitisBCenters: stats.hepatitisBCenters,
              })}
            </p>
            <p>
              {t("access", { location: locationName, stateName })}
            </p>
          </>
        ) : (
          <p>
            {t("none", { locationName, stateName })}
          </p>
        )}
      </div>

      {hasCenters && (
        <>
          <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
            {t("treatmentHeading")}
          </h3>
          <div className="text-gray-600 space-y-3">
            <p>
              {t.rich("treatments.hemodialysis", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
            <p>
              {t.rich("treatments.peritoneal", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
            <p>
              {t.rich("treatments.transplant", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
          </div>
        </>
      )}
    </div>
  );
}







