import { jsonLdMap } from "@/lib/json-ld";
import { Loader2 } from "lucide-react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

// Generate metadata dynamically based on search params
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const hasQueryParams = Object.keys(searchParams).length > 0;

  if (hasQueryParams) {
    return {
      title: "Peta Pusat Dialisis di Malaysia",
      description:
        "Cari pusat dialisis berdekatan dengan anda melalui peta interaktif. Lihat maklumat lengkap perkhidmatan pusat dialisis di Malaysia.",
      robots: {
        index: false,
        follow: false,
      },
      alternates: {
        canonical: "https://dialisis.my/peta",
      },
    };
  }

  return {
    title: "Peta Pusat Dialisis di Malaysia",
    description:
      "Cari pusat dialisis berdekatan dengan anda melalui peta interaktif. Lihat maklumat lengkap perkhidmatan pusat dialisis di Malaysia.",
    alternates: {
      canonical: "https://dialisis.my/peta",
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: "Peta Pusat Dialisis di Malaysia | Dialisis MY",
      description:
        "Cari pusat dialisis berdekatan anda melalui peta interaktif. Lihat lokasi, maklumat perhubungan dan perkhidmatan yang ditawarkan.",
      url: "https://dialisis.my/peta",
      siteName: "Dialisis MY",
      locale: "ms_MY",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Peta Pusat Dialisis di Malaysia | Dialisis MY",
      description:
        "Cari pusat dialisis berdekatan anda melalui peta interaktif. Lihat lokasi, maklumat perhubungan dan perkhidmatan yang ditawarkan.",
    },
  };
}

// Import map component dynamically to avoid SSR issues
const MapView = dynamic(() => import("@/components/map-view"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  ),
});

export default function MapPage({ searchParams }: Props) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdMap) }}
      />
      <main className="min-h-screen max-w-7xl h-[calc(100vh-40rem)] mx-auto">
        <Suspense
          fallback={
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
        >
          <MapView />
        </Suspense>
      </main>
    </>
  );
}
