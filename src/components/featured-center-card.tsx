"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PopiconsPhoneDuotone } from "@popicons/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface FeaturedCenterCardProps {
  id: string;
  name: string;
  address?: string;
  tel?: string;
  state: string;
  city: string;
  units?: string;
  hepatitisBay?: string;
  sector?: string;
  treatment?: string;
  photos?: string[];
  onImageClick?: (imageIndex: number) => void;
}

export function FeaturedCenterCard({
  id,
  name,
  address,
  tel,
  state,
  city,
  units,
  hepatitisBay,
  sector,
  treatment,
  photos = [],
  onImageClick,
}: FeaturedCenterCardProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const unitsArray = units ? units.split(",") : [];
  const title = name.split(",")[0];
  const treatmentArray = unitsArray.map((unit) => ({
    name: unit,
    value: unit.toLowerCase().includes("hd unit")
      ? "Hemodialysis"
      : unit.toLowerCase().includes("tx unit")
      ? "Transplant"
      : unit.toLowerCase().includes("mrrb unit")
      ? "MRRB"
      : "Peritoneal Dialysis",
  }));

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      scrollContainerRef.current.scrollTo({
        left: direction === "left" 
          ? currentScroll - scrollAmount 
          : currentScroll + scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
      {photos.length > 0 && (
        <div className="relative">
          <div 
            ref={scrollContainerRef}
            onScroll={checkScrollButtons}
            className="flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {photos.map((photo, index) => (
              <div
                key={index}
                className="relative flex-shrink-0 w-full sm:w-80 h-48 snap-start cursor-pointer"
                onClick={() => onImageClick?.(index)}
              >
                <Image
                  src={photo}
                  alt={`${title} - Photo ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 320px"
                />
              </div>
            ))}
          </div>
          
          {photos.length > 1 && (
            <>
              {canScrollLeft && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-md"
                  onClick={(e) => {
                    e.preventDefault();
                    scroll("left");
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              
              {canScrollRight && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-md"
                  onClick={(e) => {
                    e.preventDefault();
                    scroll("right");
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      )}
      
      <Link href={`/${state}/${encodeURIComponent(city)}/${encodeURIComponent(name)}`}>
        <CardHeader className="space-y-3">
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardTitle className="text-zinc-500 font-normal capitalize text-sm">
            {`${city}, ${state}`}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex justify-end flex-col gap-2">
          <p className="text-primary mb-2">
            {sector === "MOH" || sector === "NGO" ? (
              sector
            ) : (
              <span className="capitalize">{sector?.toLowerCase() ?? ""}</span>
            )}
          </p>

          <div className="flex flex-wrap gap-2">
            {treatmentArray.map((treatment) => (
              <Badge
                key={treatment.name}
                className="bg-blue-50 text-blue-800"
              >
                {treatment.value}
              </Badge>
            ))}
          </div>

          {address && (
            <p className="text-primary mt-4 text-sm">{address}</p>
          )}
          
          {tel && (
            <div className="flex gap-2 items-center mt-2">
              <PopiconsPhoneDuotone className="w-4 h-4 stroke-[#2bde80ff]" />
              <p className="text-primary text-sm">{tel}</p>
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}