"use client";

import { cn } from "@/lib/utils";

export default function FilterLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const title = "Pusat Dialisis di Malaysia";

  return (
    <div className="min-h-screen bg-[foreground] text-black relative">
      <div className="py-4 md:py-8">
        <div
          className={cn(
            "mb-8 p-12 flex flex-col md:flex-row justify-center md:items-center"
          )}
        >
          <div className={cn("flex flex-col md:items-center space-y-8")}>
            <h1 className={cn("text-3xl md:text-5xl font-bold")}>{title}</h1>
            <p className={cn("text-gray-600 leading-8 text-lg")}>
              {`Cari sekitar lebih 900+ pusat dialisis yang berdekatan dengan anda dengan mudah.`}
            </p>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
