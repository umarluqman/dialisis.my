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
  const locationName = cityName ? cityName : stateName;
  const fullLocationName = cityName ? `${cityName}, ${stateName}` : stateName;

  return (
    <div className="mt-12 prose max-w-none">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Tentang Perkhidmatan Dialisis di {locationName}
      </h2>
      <div className="text-gray-600 space-y-4">
        {stats.totalCenters > 0 ? (
          <>
            <p>
              {fullLocationName} mempunyai {stats.totalCenters} pusat dialisis
              yang menyediakan perkhidmatan rawatan buah pinggang untuk pesakit
              yang memerlukan. Pusat-pusat ini terdiri daripada{" "}
              {stats.mohCenters} pusat di bawah Kementerian Kesihatan Malaysia
              (MOH) dan {stats.privateCenters} pusat swasta.
            </p>
            <p>
              Kebanyakan pusat menyediakan perkhidmatan hemodialisis (
              {stats.hemodialysisCenters} pusat),
              {stats.peritonealCenters > 0 &&
                ` manakala ${stats.peritonealCenters} pusat menawarkan peritoneal dialisis`}
              {stats.peritonealCenters > 0
                ? " dan rawatan lain."
                : " manakala beberapa pusat juga menawarkan peritoneal dialisis dan rawatan lain."}
              {stats.hepatitisBCenters > 0 &&
                ` Terdapat juga ${stats.hepatitisBCenters} pusat yang mempunyai kemudahan khas untuk pesakit Hepatitis B dan C.`}
            </p>
            <p>
              Pesakit yang memerlukan rawatan dialisis di {locationName} boleh
              memilih antara pusat-pusat MOH yang menawarkan rawatan bersubsidi
              atau pusat-pusat swasta yang menyediakan kemudahan dan
              perkhidmatan tambahan. Semua pusat dialisis di Malaysia perlu
              mematuhi piawaian kualiti yang ditetapkan oleh Kementerian
              Kesihatan.
            </p>
          </>
        ) : (
          <p>
            Pada masa ini, tiada pusat dialisis yang direkodkan di{" "}
            {locationName}. Pesakit dari kawasan ini mungkin perlu mendapatkan
            rawatan di pusat dialisis yang terdekat di kawasan lain dalam{" "}
            {stateName}. Sila hubungi hospital atau klinik terdekat untuk
            mendapatkan rujukan kepada pusat dialisis yang sesuai.
          </p>
        )}
      </div>

      {stats.totalCenters > 0 && (
        <>
          <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
            Jenis-jenis Rawatan Dialisis
          </h3>
          <div className="text-gray-600 space-y-3">
            <p>
              <strong>Hemodialisis:</strong> Rawatan yang menggunakan mesin
              dialisis untuk membersihkan darah dari toksin dan cecair
              berlebihan. Biasanya dilakukan 3 kali seminggu, setiap sesi
              mengambil masa 3-4 jam.
            </p>
            <p>
              <strong>Peritoneal Dialisis:</strong> Rawatan yang menggunakan
              selaput perut (peritoneum) sebagai penapis semula jadi. Boleh
              dilakukan di rumah dan memberikan fleksibiliti yang lebih kepada
              pesakit.
            </p>
            <p>
              <strong>Transplantasi Buah Pinggang:</strong> Rawatan terbaik
              untuk pesakit yang sesuai, di mana buah pinggang yang sihat
              daripada penderma ditransplant kepada pesakit.
            </p>
          </div>
        </>
      )}
    </div>
  );
}








