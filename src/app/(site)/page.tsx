import FilterLayout from "@/components/filter-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { MailIcon, PhoneCallIcon } from "lucide-react";

async function getDialysisCenters() {
  const centers = await prisma.dialysisCenter.findMany();
  return centers;
}

export default async function DialysisCenterDirectory() {
  const data = await getDialysisCenters();
  console.log("data", data);

  return (
    <FilterLayout>
      <div className="min-h-screen bg-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 grid-rows-[repeat(auto-fill,minmax(0,auto))]">
          {data.map((item) => (
            <Card
              key={item.id}
              className="shadow-sm hover:border-primary transition-shadow"
            >
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
          ))}
        </div>
      </div>
    </FilterLayout>
  );
}
