"use client";

import { CheckCircle, MapPin, Shield } from "lucide-react";

export default function FilterLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-sage-50 py-12 md:py-20">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

        <div className="container relative mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Pusat Dialisis{" "}
              <span className="text-primary">di Malaysia</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Cari lebih daripada 900 pusat dialisis berdekatan dengan anda.
              Maklumat lengkap untuk membantu anda membuat keputusan yang tepat.
            </p>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-muted-foreground animate-fade-in [animation-delay:200ms]">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              Maklumat Terkini
            </span>
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Sumber Rasmi
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Seluruh Malaysia
            </span>
          </div>
        </div>
      </section>

      {children}
    </div>
  );
}
