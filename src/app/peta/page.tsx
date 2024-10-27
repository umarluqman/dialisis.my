import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

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
  );
}
