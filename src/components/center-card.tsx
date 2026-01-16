"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCenterImages } from "@/hooks/use-center-images";
import {
  PopiconsArrowRightLine,
  PopiconsMapLine,
  PopiconsPhoneLine,
} from "@popicons/react";
import clsx from "clsx";
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

  return (
    <Card
      className={`shadow-sm transition-shadow flex flex-col min-h-fit relative ${
        isFeatured
          ? "shadow-primary/25 bg-gradient-to-br from-primary/5 to-primary/5 shadow-lg border-primary border-2"
          : ""
      }`}
    >
      {isFeatured && (
        <Badge className="absolute -top-2 right-4 bg-amber-400 text-amber-950 shadow-sm shadow-amber-400/25 px-3 py-1 border-none z-10">
          Pilihan Utama
        </Badge>
      )}

      {/* Photo Gallery for Featured Centers */}
      {isFeatured && (
        <div className="p-4 pb-0">
          {imagesLoading ? (
            <div className="relative aspect-[4/3] rounded-lg bg-zinc-100 animate-pulse flex items-center justify-center">
              <div className="text-zinc-400 text-sm">Loading images...</div>
            </div>
          ) : galleryImages.length > 0 ? (
            <CenterCardGallery images={galleryImages} centerName={title} />
          ) : null}
        </div>
      )}

      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-bold text-foreground">
          {title}
        </CardTitle>
        <div className="flex justify-between w-full">
          <CardTitle className="text-zinc-500 font-medium capitalize text-base">{`${
            town ? town + ", " : ""
          }${state.name}`}</CardTitle>

          <p className="text-primary-foreground mb-4 text-sm">
            {sector === "MOH" ||
            sector === "NGO" ||
            sector === "MOH_PRIVATE" ? (
              sector === "MOH" ? (
                "Kerajaan"
              ) : sector === "MOH_PRIVATE" ? (
                "Kerajaan & Swasta"
              ) : (
                sector
              )
            ) : (
              <span className="capitalize">
                {sector?.toLowerCase() === "private"
                  ? "Swasta"
                  : sector?.toLowerCase()}
              </span>
            )}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <div
          className={`flex-1 rounded-t-[10px] flex flex-col ${
            isFeatured ? "transparent" : "bg-white"
          }`}
        >
          {/* <p className="mt-3 text-zinc-600">{address}</p> */}
          {showService && (
            <div className="flex flex-col gap-2 my-2">
              <div className="text-sm text-zinc-600">Servis Rawatan</div>
              <div className="flex flex-wrap gap-2">
                {treatmentArray.map((treatment) => (
                  <Badge
                    key={treatment.name}
                    className="bg-[#a3bdffff]/20 text-[#375092ff] shadow-none font-normal border- border-primary-foreground/25"
                  >
                    {treatment.value}
                  </Badge>
                ))}{" "}
              </div>
            </div>
          )}

          {showService && (
            <div className="flex flex-wrap mb-4">
              {hepatitisArray.length > 0 ? (
                <div className="flex items-center gap-2">
                  {hepatitisArray.map((hep) => (
                    <Badge
                      key={hep}
                      className="bg-amber-100 text-base text-amber-800 shadow-none hover:bg-amber-200 font-normal"
                    >
                      {hep}
                    </Badge>
                  ))}
                  {/* <PopiconsCircleInfoLine className="cursor-pointer w-4 h-4 text-zinc-500" /> */}
                </div>
              ) : null}
            </div>
          )}

          <div className="flex flex-wrap gap-3 justify-end mt-4">
            <Button
              variant="outline"
              className="px-4 border-primary-foreground/30"
              onClick={() => (window.location.href = `tel:${phoneNumber}`)}
            >
              <PopiconsPhoneLine className="w-4 h-4 text-primary-foreground" />
              Panggil
            </Button>
            {isFeatured && phoneNumber ? (
              <Button
                variant="outline"
                className="px-4 border-primary-foreground/30"
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
                  width={20}
                  height={20}
                />
                WhatsApp
              </Button>
            ) : null}

            {/* <Button
              variant={"outline"}
              className="px-4 border-primary-foreground/30"
              onClick={() => (window.location.href = `mailto:${email}`)}
            >
              <PopiconsMailLine className="w-4 h-4 text-primary-foreground" />
              Emel
            </Button> */}

            <Link
              href={`https://www.google.com/maps?q=${latitude},${longitude}`}
              target="_blank"
            >
              <Button
                variant="outline"
                className="px-4 border-primary-foreground/30"
              >
                <PopiconsMapLine className="w-4 h-4 text-primary-foreground" />
                Lokasi
              </Button>
            </Link>
            <Link href={`/${slug}`} scroll={false}>
              <Button
                variant={isFeatured ? "default" : "secondary"}
                className={clsx(
                  "w-full md:w-auto flex items-center justify-center md:justify-self-end",
                  {
                    "bg-[#0565f2] hover:bg-[#0565f2]/95 text-secondary shadow-primary/25 hover:shadow-lg hover:shadow-primary-foreground/25 transition-all":
                      isFeatured,
                  }
                )}
              >
                Info Lanjut
                <PopiconsArrowRightLine className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            {/* {website && (
              <Link
                href={website.split("?")[0] + "?ref=dialisis.my"}
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                <Button
                  variant={"outline"}
                  className="border-primary-foreground/30 mb-4"
                >
                  <PopiconsGlobeLine className="w-4 h-4 text-primary-foreground" />
                  Laman Web
                </Button>
              </Link>
            )} */}
          </div>

          {/* <div className="mt-auto pt-6">
            
          </div> */}
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
