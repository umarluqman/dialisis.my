"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCenterImages } from "@/hooks/use-center-images";
import { cn } from "@/lib/utils";
import {
  PopiconsArrowRightLine,
  PopiconsMapLine,
  PopiconsPhoneLine,
} from "@popicons/react";
import Image from "next/image";
import Link from "next/link";
import { CenterCardGallery } from "./center-card-gallery";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface CenterCardProps {
  slug: string;
  id: string;
  dialysisCenterName: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  state: {
    name: string;
  };
  town: string;
  units?: string;
  hepatitisBay?: string;
  sector?: string;
  treatment?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  showService?: boolean;
  featured: boolean;
  photos?: string;
}

// Helper function to parse photos string into array
function parsePhotos(photosString?: string) {
  if (!photosString) return [];

  try {
    const parsed = JSON.parse(photosString);
    if (Array.isArray(parsed)) {
      return parsed.map((photo, index) => ({
        src: photo.src || photo,
        alt: photo.alt || `Image ${index + 1}`,
      }));
    }
    return [];
  } catch {
    // If parsing fails, treat as comma-separated URLs
    return photosString
      .split(",")
      .filter(Boolean)
      .map((url, index) => ({
        src: url.trim(),
        alt: `Image ${index + 1}`,
      }));
  }
}

export function CenterCard({
  slug,
  id,
  dialysisCenterName,
  address,
  featured,
  phoneNumber,
  email,
  state,
  town,
  hepatitisBay,
  sector,
  units,
  website,
  latitude,
  showService = true,
  longitude,
  photos,
}: CenterCardProps) {
  const unitsArray = units ? units.split(",") : [];
  const title = dialysisCenterName?.split(",")[0];

  const hepatitisArray = hepatitisBay ? hepatitisBay.split(", ") : [];
  const treatmentArray = unitsArray.map((unit) => ({
    name: unit,
    value: unit.toLowerCase().includes("hd unit")
      ? "Hemodialisis"
      : unit.toLowerCase().includes("tx unit")
      ? "Transplant"
      : unit.toLowerCase().includes("mrrb unit")
      ? "MRRB"
      : "Peritoneal Dialisis",
  }));

  const isFeatured = featured;

  // Fetch images from API for featured centers
  const { images: apiImages, isLoading: imagesLoading } = useCenterImages(
    id,
    isFeatured
  );

  // Get images based on whether it's featured or not
  const galleryImages = isFeatured
    ? apiImages.length > 0
      ? apiImages.map((img) => ({
          src: img.url,
          alt: img.altText || `${dialysisCenterName} - Gallery Image`,
        }))
      : getSampleImages(town, dialysisCenterName) // Fallback to sample images if no API images
    : parsePhotos(photos);

  const getSectorVariant = () => {
    if (sector === "MOH" || sector === "MOH_PRIVATE") return "government";
    if (sector === "NGO") return "ngo";
    return "private";
  };

  const getSectorLabel = () => {
    if (sector === "MOH") return "Kerajaan";
    if (sector === "MOH_PRIVATE") return "Kerajaan & Swasta";
    if (sector === "NGO") return "NGO";
    if (sector?.toLowerCase() === "private") return "Swasta";
    return sector;
  };

  return (
    <Card
      className={cn(
        "group flex flex-col min-h-fit relative overflow-hidden",
        isFeatured && [
          "ring-2 ring-primary/20",
          "bg-gradient-to-br from-primary/[0.02] to-accent/[0.02]",
        ]
      )}
    >
      {isFeatured && (
        <Badge
          variant="featured"
          className="absolute -top-0.5 right-4 z-10"
        >
          Pilihan Utama
        </Badge>
      )}

      {/* Photo Gallery for Featured Centers */}
      {isFeatured && (
        <div className="p-4 pb-0">
          {imagesLoading ? (
            <div className="relative aspect-[4/3] rounded-lg bg-muted animate-pulse flex items-center justify-center">
              <div className="text-muted-foreground text-sm">Memuatkan...</div>
            </div>
          ) : galleryImages.length > 0 ? (
            <div className="overflow-hidden rounded-lg">
              <CenterCardGallery images={galleryImages} centerName={title} />
            </div>
          ) : null}
        </div>
      )}

      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        <div className="flex justify-between items-center w-full">
          <p className="text-muted-foreground font-medium text-sm capitalize">
            {town ? `${town}, ` : ""}{state.name}
          </p>
          <Badge variant={getSectorVariant() as "government" | "private" | "ngo"}>
            {getSectorLabel()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 pt-2">
        {showService && (
          <div className="space-y-3 mb-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Perkhidmatan
            </p>
            <div className="flex flex-wrap gap-2">
              {treatmentArray.map((treatment) => (
                <Badge key={treatment.name} variant="treatment">
                  {treatment.value}
                </Badge>
              ))}
              {hepatitisArray.map((hep) => (
                <Badge key={hep} variant="hepatitis">
                  {hep}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-border/50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = `tel:${phoneNumber}`)}
          >
            <PopiconsPhoneLine className="w-4 h-4" />
            Panggil
          </Button>

          {isFeatured && phoneNumber && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                (window.location.href = `https://wa.me/+6${phoneNumber.replace(
                  /[\s-]/g,
                  ""
                )}`)
              }
            >
              <Image
                src="/whatsapp.svg"
                alt="WhatsApp"
                width={16}
                height={16}
              />
              WhatsApp
            </Button>
          )}

          <Link
            href={`https://www.google.com/maps?q=${latitude},${longitude}`}
            target="_blank"
          >
            <Button variant="outline" size="sm">
              <PopiconsMapLine className="w-4 h-4" />
              Lokasi
            </Button>
          </Link>

          <Link href={`/${slug}`} scroll={false} className="ml-auto">
            <Button variant={isFeatured ? "trust" : "default"} size="sm">
              Info Lanjut
              <PopiconsArrowRightLine className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Temporary function to provide sample images for featured centers
function getSampleImages(town: string, centerName: string) {
  // Sample images for demonstration
  const sampleSets = [
    [
      {
        src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
        alt: "Ruang rawatan dialisis",
      },
      {
        src: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800",
        alt: "Peralatan dialisis moden",
      },
      {
        src: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800",
        alt: "Bilik rawatan",
      },
      {
        src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800",
        alt: "Kakitangan perubatan",
      },
    ],
    [
      {
        src: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800",
        alt: "Kaunter pendaftaran",
      },
      {
        src: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800",
        alt: "Ruang menunggu",
      },
      {
        src: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800",
        alt: "Doktor bertugas",
      },
    ],
    [
      {
        src: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=800",
        alt: "Bangunan pusat dialisis",
      },
      {
        src: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800",
        alt: "Ruang rawatan bersih",
      },
      {
        src: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800",
        alt: "Peralatan perubatan",
      },
    ],
  ];

  // Use a consistent set based on center name hash
  const hash = centerName
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return sampleSets[hash % sampleSets.length];
}
