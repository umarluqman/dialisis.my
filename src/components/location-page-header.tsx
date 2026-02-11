import Link from "next/link";

interface LocationPageHeaderProps {
  stateName: string;
  cityName?: string;
  stateSlug: string;
  totalCenters: number;
  stats: {
    mohCenters: number;
    privateCenters: number;
    hepatitisBCenters: number;
    hepatitisCCenters: number;
  };
}

export function LocationPageHeader({
  stateName,
  cityName,
  stateSlug,
  totalCenters,
  stats,
}: LocationPageHeaderProps) {
  const locationName = cityName ? `${cityName}, ${stateName}` : stateName;

  return (
    <div className="mb-8">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Pusat Dialisis di {locationName}
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Terdapat <strong>{totalCenters} pusat dialisis</strong> di{" "}
          {locationName}.
          {totalCenters > 0 && (
            <>
              {" "}
              Termasuk {stats.mohCenters} pusat MOH, {stats.privateCenters}{" "}
              pusat swasta, {stats.hepatitisBCenters} pusat dengan kemudahan
              hepatitis B, dan {stats.hepatitisCCenters} pusat dengan kemudahan
              hepatitis C.
            </>
          )}
        </p>

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Laman Utama
              </Link>
            </li>
            <li aria-hidden="true">
              <span className="mx-2">›</span>
            </li>
            {cityName ? (
              <>
                <li>
                  <Link
                    href={`/lokasi/${stateSlug}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {stateName}
                  </Link>
                </li>
                <li aria-hidden="true">
                  <span className="mx-2">›</span>
                </li>
                <li>
                  <span className="text-gray-900">{cityName}</span>
                </li>
              </>
            ) : (
              <li>
                <span className="text-gray-900">{stateName}</span>
              </li>
            )}
          </ol>
        </nav>
      </div>

      {/* Stats */}
      {totalCenters > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground">
              {totalCenters}
            </div>
            <div className="text-sm text-muted-foreground">Jumlah Pusat</div>
          </div>
          <div className="hidden md:block w-px h-8 bg-border" />
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground">
              {stats.mohCenters}
            </div>
            <div className="text-sm text-muted-foreground">Pusat MOH</div>
          </div>
          <div className="hidden md:block w-px h-8 bg-border" />
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground">
              {stats.privateCenters}
            </div>
            <div className="text-sm text-muted-foreground">Pusat Swasta</div>
          </div>
          <div className="hidden md:block w-px h-8 bg-border" />
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground">
              {stats.hepatitisBCenters}
            </div>
            <div className="text-sm text-muted-foreground">Hepatitis B</div>
          </div>
          <div className="hidden md:block w-px h-8 bg-border" />
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground">
              {stats.hepatitisCCenters}
            </div>
            <div className="text-sm text-muted-foreground">Hepatitis C</div>
          </div>
        </div>
      )}
    </div>
  );
}
