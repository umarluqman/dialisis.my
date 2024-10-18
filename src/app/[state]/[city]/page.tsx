import { CenterCard } from "@/components/center-card";
import { prisma } from "@/lib/db";

// SEO metadata
import type { Metadata } from "next";
export async function generateMetadata({
  params,
}: {
  params: { state: string; city: string };
}): Promise<Metadata> {
  return { title: `Dialysis Centers in ${params.city}, ${params.state}` };
}

// Like getStaticPaths
export async function generateStaticParams() {
  const centers = await prisma.dialysisCenter.findMany({
    select: {
      state: { select: { name: true } },
      town: true,
    },
    distinct: ["stateId", "town"],
  });

  return centers.map((center) => ({
    state: center.state.name.toLowerCase(),
    city: center.town,
  }));
}

async function getDialysisCenters(state: string, city: string) {
  const centers = await prisma.dialysisCenter.findMany({
    where: {
      state: {
        name: state
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      },
      town: city,
    },
    include: {
      state: true,
    },
  });
  return centers;
}

const CityLayout = async ({
  params,
}: {
  params: { state: string; city: string };
}) => {
  const data = await getDialysisCenters(
    params.state,
    params.city.charAt(0).toUpperCase() + params.city.slice(1)
  );

  if (!data || data.length === 0) {
    return (
      <p>
        No dialysis centers found in {params.city}, {params.state}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-8 max-w-screen-xl mx-auto">
        {data.map((item) => (
          <CenterCard
            key={item.id}
            id={item.id}
            name={item.name}
            address={item.address}
            tel={item.tel}
            email={item.email}
            state={params.state}
            city={params.city}
          />
        ))}
      </div>
    </div>
  );
};

export default CityLayout;
