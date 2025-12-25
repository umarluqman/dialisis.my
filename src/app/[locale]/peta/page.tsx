import { jsonLdMap } from "@/lib/json-ld";
import { Loader2 } from "lucide-react";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";
import { Suspense } from "react";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

// Generate metadata dynamically based on search params
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const t = await getTranslations("map.metadata");
  const locale = await getLocale();
  const ogLocale = locale === "ms" ? "ms_MY" : "en_US";
  const hasQueryParams = Object.keys(searchParams).length > 0;

  if (hasQueryParams) {
    return {
      title: t("title"),
      description: t("description"),
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
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: "https://dialisis.my/peta",
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: "https://dialisis.my/peta",
      siteName: "Dialisis MY",
      locale: ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
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
