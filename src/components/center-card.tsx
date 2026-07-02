"use client";

import { IntakeLeadDialog } from "@/components/intake-lead-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCenterImages } from "@/hooks/use-center-images";
import { getPrimaryCenterPhoneNumber } from "@/lib/center-phone-numbers";
import { getAvailableHepatitisOptions } from "@/lib/hepatitis";
import { ArrowRight, CalendarPlus, MapPin, Phone } from "lucide-react";
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
  tel?: string;
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
  featured,
  phoneNumber,
  tel,
  state,
  town,
  hepatitisBay,
  sector,
  units,
  latitude,
  showService = true,
  longitude,
  photos,
}: CenterCardProps) {
  const unitsArray = units ? units.split(",") : [];
  const title = dialysisCenterName?.split(",")[0];

  const hepatitisArray = getAvailableHepatitisOptions(hepatitisBay);
  const treatmentArray = unitsArray
    .map((unit) => ({
      name: unit,
      value: unit.toLowerCase().includes("hd unit")
        ? "Hemodialisis"
        : unit.toLowerCase().includes("tx unit")
        ? "Transplant"
        : unit.toLowerCase().includes("mrrb unit")
        ? "MRRB"
        : "Peritoneal Dialisis",
    }))
    .slice(0, 2);

  const isFeatured = featured;
  const primaryPhoneNumber = getPrimaryCenterPhoneNumber({ phoneNumber, tel });

  const { images: apiImages, isLoading: imagesLoading } = useCenterImages(
    id,
    isFeatured
  );

  const galleryImages = isFeatured
    ? apiImages.length > 0
      ? apiImages.map((img) => ({
          src: img.url,
          alt: img.altText || `${dialysisCenterName} - Gallery Image`,
        }))
      : getSampleImages(town, dialysisCenterName)
    : parsePhotos(photos);

  const getSectorLabel = (sector?: string) => {
    if (!sector) return null;
    switch (sector) {
      case "MOH":
        return "Kerajaan";
      case "MOH_PRIVATE":
        return "Kerajaan & Swasta";
      case "PRIVATE":
        return "Swasta";
      default:
        return sector;
    }
  };

  return (
    <Card
      data-ga-context="center_card"
      data-center-id={id}
      data-center-slug={slug}
      data-center-name={title}
      data-center-town={town}
      data-center-state={state.name}
      className={`flex flex-col min-h-fit relative overflow-hidden ${
        isFeatured
          ? "shadow-warm-lg border-2 border-primary/20 bg-gradient-to-br from-primary-light to-card"
          : "shadow-warm"
      }`}
    >
      {isFeatured && (
        <div className="p-4 pb-0">
          {imagesLoading ? (
            <div className="relative aspect-[16/9] rounded-xl bg-muted animate-pulse flex items-center justify-center">
              <div className="text-muted-foreground text-sm">
                Memuatkan gambar...
              </div>
            </div>
          ) : galleryImages.length > 0 ? (
            <CenterCardGallery images={galleryImages} centerName={title} />
          ) : null}
        </div>
      )}

      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-display font-semibold text-foreground leading-tight">
          {title}
        </CardTitle>
        <div className="flex items-center justify-between w-full mt-1">
          <p className="text-muted-foreground text-sm capitalize">
            {town ? `${town}, ` : ""}
            {state.name}
          </p>
          {sector && (
            <Badge variant="subtle" className="text-xs">
              {getSectorLabel(sector)}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 pt-2">
        {showService && treatmentArray.length > 0 && (
          <div className="flex flex-col gap-2 mb-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Servis Rawatan
            </p>
            <div className="flex flex-wrap gap-1.5">
              {treatmentArray.map((treatment) => (
                <Badge key={treatment.name} variant="subtle" className="text-xs">
                  {treatment.value}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {showService && hepatitisArray.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {hepatitisArray.map((hep) => (
              <Badge key={hep} variant="hepatitis" className="text-xs">
                {hep}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-auto pt-4">
          {primaryPhoneNumber && (
            <Button variant="outline" size="sm" asChild>
              <a href={`tel:${primaryPhoneNumber}`}>
                <Phone className="w-4 h-4" />
                Panggil
              </a>
            </Button>
          )}

          {isFeatured && (
            <IntakeLeadDialog centerId={id} centerName={title}>
              <Button variant="outline" size="sm">
                <CalendarPlus className="w-4 h-4" />
                Temujanji
              </Button>
            </IntakeLeadDialog>
          )}

          {latitude && longitude && (
            <Link
              href={`https://www.google.com/maps?q=${latitude},${longitude}`}
              target="_blank"
            >
              <Button variant="outline" size="sm">
                <MapPin className="w-4 h-4" />
                Lokasi
              </Button>
            </Link>
          )}

          <Link href={`/${slug}`} scroll={false} className="ml-auto">
            <Button
              variant={isFeatured ? "default" : "secondary"}
              size="sm"
              className={isFeatured ? "shadow-warm-md" : ""}
            >
              Info Lanjut
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function getSampleImages(town: string, centerName: string) {
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

  const hash = centerName
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return sampleSets[hash % sampleSets.length];
}
