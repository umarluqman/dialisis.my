import { jsonLdMap } from "@/lib/json-ld";
import { Loader2 } from "lucide-react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Metadata export
export const metadata: Metadata = {
  title: "Peta Pusat Dialisis Malaysia",
  description:
    "Cari pusat dialisis berdekatan anda melalui peta interaktif. Lihat lokasi, maklumat perhubungan dan perkhidmatan yang ditawarkan oleh pusat dialisis di seluruh Malaysia.",
  openGraph: {
    title: "Peta Pusat Dialisis Malaysia | Dialisis MY",
    description:
      "Cari pusat dialisis berdekatan anda melalui peta interaktif. Lihat lokasi, maklumat perhubungan dan perkhidmatan yang ditawarkan.",
    url: "https://dialisis.my/peta",
    siteName: "Dialisis MY",
    locale: "ms_MY",
    type: "website",
  },
  alternates: {
    canonical: "https://dialisis.my/peta",
  },
};

// Import map component dynamically to avoid SSR issues
const MapView = dynamic(() => import("@/components/map-view"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  ),
});

export default function MapPage() {
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
