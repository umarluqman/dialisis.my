import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { promises as fs } from "fs";
import { MailIcon, PhoneCallIcon } from "lucide-react";
import Link from "next/link";
import path from "path";

// FIXME: uncomment here to connect to your DB.
// request has `revalidate: 10`.
// async function getData() {
//   const res = await fetch('https://...', { next: { revalidate: 10 } });
//   return res.json();
// }

// Like getStaticPaths
// export async function generateStaticParams() {
//   const variantsUrls = await DB

//   return postSlugs?.map((slug) => ({
//     slug,
//   }));
// }

// SEO metadata
// import type { Metadata } from 'next'
// export async function generateMetadata({ params }): Promise<Metadata> {
//   const product = await DB;
//   return { title: product.title }
// }

async function getData(slug: string) {
  const jsonDirectory = path.join(process.cwd(), "data", "json");
  const filePath = path.join(jsonDirectory, `${slug}.json`);

  try {
    const fileContents = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error reading file for ${slug}:`, error);
    return null;
  }
}

const VariantLayout = async ({ params }: { params: { slug: string } }) => {
  const data = await getData(params.slug);

  if (!data) {
    return <p>No data found for: {params.slug}</p>;
  }
  console.log(data);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full justify-center py-16">
        <h1 className="text-4xl font-bold">
          Pusat Dialisis di <span className="capitalize">{params.slug}</span>
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-8 max-w-screen-xl mx-auto">
        {data.map((item: any) => {
          return (
            <Link
              href={`https://www.google.com/search?q=${encodeURIComponent(
                item.name
              )}`}
              key={item.name}
              target="_blank"
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
          );
        })}
      </div>
    </div>
  );
};

export default VariantLayout;
