import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { MailIcon, PhoneCallIcon } from "lucide-react";
import Link from "next/link";

// SEO metadata
import type { Metadata } from "next";
export async function generateMetadata({
  params,
}: {
  params: { state: string };
}): Promise<Metadata> {
  return { title: `Dialysis Centers in ${params.state}` };
}

// Like getStaticPaths
export async function generateStaticParams() {
  const states = await prisma.state.findMany();
  return states.map((state) => ({
    state: state.name.replace(/\s+/g, "-").toLowerCase(),
  }));
}

async function getDialysisCenters(state: string) {
  const centers = await prisma.dialysisCenter.findMany({
    where: {
      state: {
        name: state,
      },
    },
    include: {
      state: true,
    },
  });
  return centers;
}

const VariantLayout = async ({ params }: { params: { state: string } }) => {
  const data = await getDialysisCenters(params.state);
  console.log("data", data);

  if (!data || data.length === 0) {
    return <p>No dialysis centers found for: {params.state}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-8 max-w-screen-xl mx-auto">
        {data.map((item) => (
          <Link
            href={`/${params.state}/${encodeURIComponent(
              item.town
            )}/${encodeURIComponent(item.name)}`}
            key={item.id}
          >
            <Card className="shadow-sm hover:border-primary transition-shadow">
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <p className="text-primary mb-4">{item.address}</p>
                <div className="flex gap-2 items-center">
                  <PhoneCallIcon className="w-4 h-4" />
                  <p className="text-primary">{item.tel}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <MailIcon className="w-4 h-4" />
                  <p className="text-primary">{item.email}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VariantLayout;
