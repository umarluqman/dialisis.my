"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ImagesResponse } from "@/types/center-image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Car,
  ExternalLink,
  Globe,
  Heart,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Shield,
  Star,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import useSWR from "swr";
import { Badge } from "./ui/badge";

// Import map component dynamically to avoid SSR issues
const SingleCenterMap = dynamic(
  () => import("@/components/single-center-map"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-80 items-center justify-center bg-gray-100 rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    ),
  }
);

// Dummy benefits data
const BENEFITS = [
  {
    icon: <Heart className="h-8 w-8 text-rose-500" />,
    title: "Rawatan Hemodialisis Berkualiti",
    description:
      "Pusat kami menawarkan perawatan dialisis berkualiti tinggi dengan peralatan moden dan kakitangan yang berpengalaman.",
  },
  {
    icon: <Star className="h-8 w-8 text-purple-500" />,
    title: "Pasukan Rawatan Berpengalaman & Mesra",
    description:
      "Pasukan perubatan kami terdiri daripada pakar yang berpengalaman dan mesra dalam memberikan penjagaan terbaik kepada pesakit.",
  },
  {
    icon: <Car className="h-8 w-8 text-blue-500" />,
    title: "⁠Mudah diakses dengan kemudahan parkir",
    description:
      "Lokasi strategik dengan tempat letak kereta yang mencukupi untuk kemudahan pesakit dan pelawat.",
  },
  {
    icon: <Shield className="h-8 w-8 text-green-500" />,
    title: "⁠Ruang rawatan bersih dan berhawa dingin",
    description:
      "Ruang rawatan yang bersih dan selesa dengan sistem penghawa dingin untuk keselesaan pesakit semasa rawatan.",
  },
];

interface Props {
  center: {
    id: string;
    slug: string;
    dialysisCenterName: string;
    sector: string;
    drInCharge: string;
    drInChargeTel: string;
    address: string;
    addressWithUnit: string;
    tel: string;
    fax?: string;
    panelNephrologist?: string;
    centreManager?: string;
    centreCoordinator?: string;
    email?: string;
    hepatitisBay?: string;
    longitude?: number;
    latitude?: number;
    phoneNumber: string;
    website?: string;
    title: string;
    units: string;
    description?: string;
    benefits?: string;
    photos?: string;
    videos?: string;
    stateId: string;
    createdAt: Date;
    updatedAt: Date;
    town: string;
    featured: boolean;
    state: {
      name: string;
    };
  };
}

export function EnhancedDialysisCenterDetails({ center }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch center images from API
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const {
    data: imagesData,
    error,
    isLoading,
  } = useSWR<ImagesResponse>(`/api/centers/${center.id}/images`, fetcher);

  // Fallback images for centers without uploaded images
  const isInBachok = center.town === "Bachok";
  const FALLBACK_IMAGES = isInBachok
    ? [
        {
          src: "/contoh/as-salam-bachok/satu.webp",
          alt: "pusat-hemodialisis-as-salam",
        },
        {
          src: "/contoh/as-salam-bachok/tiga.webp",
          alt: "pasukan-pusat-hemodialisis-as-salam",
        },
        {
          src: "/contoh/as-salam-bachok/empat.webp",
          alt: "lokasi-pusat-hemodialisis-as-salam",
        },
        {
          src: "/contoh/as-salam-bachok/dua.webp",
          alt: "ruang-pusat-hemodialisis-as-salam",
        },
      ]
    : [
        {
          src: "/contoh/satu.webp",
          alt: "pusat-hemodialisis-as-salam",
        },
        {
          src: "/contoh/tiga.webp",
          alt: "pasukan-pusat-hemodialisis-as-salam",
        },
        {
          src: "/contoh/empat.webp",
          alt: "lokasi-pusat-hemodialisis-as-salam",
        },
        {
          src: "/contoh/dua.webp",
          alt: "ruang-pusat-hemodialisis-as-salam",
        },
      ];

  // Use uploaded images if available, otherwise fallback to default images
  const GALLERY_IMAGES =
    imagesData?.images && imagesData.images.length > 0
      ? imagesData.images.map((img) => ({
          src: img.url,
          alt: img.altText,
        }))
      : FALLBACK_IMAGES;

  const stateName = center.state.name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const shortAddress = center.town ? `${center.town}, ${stateName}` : stateName;

  const hepatitisArray = center.hepatitisBay
    ? center.hepatitisBay.split(", ")
    : [];
  const treatmentArray = center.units
    ? center.units.split(", ").map((unit) => ({
        name: unit,
        value: unit.toLowerCase().includes("hd unit")
          ? "Hemodialisis"
          : unit.toLowerCase().includes("tx unit")
          ? "Transplant"
          : unit.toLowerCase().includes("mrrb unit")
          ? "MRRB"
          : "Peritoneal Dialisis",
      }))
    : [];

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 pb-28">
        {/* Header Section */}
        <div className="space-y-2 text-center md:text-left md:flex md:justify-between md:items-end">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold">
              {center.dialysisCenterName}
            </h1>
            <p className="text-muted-foreground text-lg mt-2">{shortAddress}</p>
          </div>
          <div className="flex gap-2 flex-wrap justify-center md:justify-end mt-4 md:mt-0">
            {treatmentArray.map((treatment) => (
              <Badge
                key={treatment.name}
                className="bg-[#a3bdffff]/20 text-[#375092ff] hover:bg-[#a3bdffff]/50 shadow-none font-normal text-base"
              >
                {treatment.value}
              </Badge>
            ))}
            {hepatitisArray.map((hep) => (
              <Badge
                key={hep}
                className="bg-amber-100 text-base text-amber-800 shadow-none hover:bg-amber-200 font-normal"
              >
                {hep}
              </Badge>
            ))}
          </div>
        </div>

        {/* Gallery Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Galeri</h2>
          <div className="relative">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center bg-gray-100 rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-gray-600">Memuatkan galeri...</span>
              </div>
            ) : error ? (
              <div className="flex h-64 items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-gray-600">Menggunakan gambar contoh</p>
              </div>
            ) : (
              <Carousel className="w-full">
                <CarouselContent>
                  {GALLERY_IMAGES.map((image, index) => (
                    <CarouselItem
                      key={index}
                      className="md:basis-1/2 lg:basis-1/3 relative"
                    >
                      <div className="p-1">
                        <div
                          className="overflow-hidden rounded-lg cursor-pointer relative"
                          onClick={() => setSelectedImage(image.src)}
                        >
                          <Image
                            src={image.src}
                            alt={image.alt}
                            width={400}
                            height={300}
                            className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
                          />
                          {index === 0 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: [0, 0.7, 0] }}
                              transition={{
                                repeat: 3,
                                duration: 2,
                                delay: 1,
                              }}
                              className="absolute inset-0 md:hidden bg-gradient-to-l from-black/20 to-transparent pointer-events-none"
                            />
                          )}
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {/* Desktop Navigation */}
                <div className="hidden md:block">
                  <CarouselPrevious className="-left-4 lg:-left-6" />
                  <CarouselNext className="-right-4 lg:-right-6" />
                </div>
                {/* Mobile Navigation */}
                <div className="md:hidden">
                  <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 -translate-x-1/2 shadow-md" />
                  <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 translate-x-1/2 shadow-md" />
                </div>
              </Carousel>
            )}
          </div>
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-4xl max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={selectedImage}
                  alt="Expanded gallery image"
                  width={1200}
                  height={800}
                  className="max-h-[85vh] w-auto object-contain rounded-lg"
                />
                <button
                  className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2"
                  onClick={() => setSelectedImage(null)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Location & Contact */}
        <div className="mt-16 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Lokasi & Hubungi</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex gap-2 items-start">
                  <MapPin className="w-5 h-5 text-primary-foreground mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Alamat:</p>
                    <p className="text-muted-foreground">
                      {center.addressWithUnit}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    asChild
                  >
                    <a
                      href={`https://www.waze.com/ul?ll=${center.latitude},${center.longitude}&navigate=yes`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      Waze <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        center.addressWithUnit
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      Google Maps
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {center.phoneNumber && (
                  <div className="flex gap-2 items-center">
                    <Phone className="w-5 h-5 text-primary-foreground flex-shrink-0" />
                    <div>
                      <p className="font-medium">Telefon:</p>
                      <a
                        href={`tel:${center.phoneNumber}`}
                        className="text-primary-foreground hover:underline"
                      >
                        {center.phoneNumber}
                      </a>
                    </div>
                  </div>
                )}

                {center.email && (
                  <div className="flex gap-2 items-center">
                    <Mail className="w-5 h-5 text-primary-foreground flex-shrink-0" />
                    <div>
                      <p className="font-medium">E-mel:</p>
                      <a
                        href={`mailto:${center.email}`}
                        className="text-primary-foreground hover:underline"
                      >
                        {center.email}
                      </a>
                    </div>
                  </div>
                )}

                {center.website && (
                  <div className="flex gap-2 items-center">
                    <Globe className="w-5 h-5 text-primary-foreground flex-shrink-0" />
                    <div>
                      <p className="font-medium">Laman Web:</p>
                      <a
                        href={center.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-foreground hover:underline"
                      >
                        {center.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Medical Staff Section */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-6">
                Doktor & Kakitangan Perubatan
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-zinc-500">Doktor bertugas</p>
                  <p className="text-lg">{center.drInCharge}</p>
                  {center.drInChargeTel && (
                    <a
                      href={`tel:${center.drInChargeTel}`}
                      className="inline-flex items-center gap-2 text-primary-foreground hover:underline mt-1"
                    >
                      <Phone className="w-4 h-4" />
                      {center.drInChargeTel}
                    </a>
                  )}
                </div>

                {center.panelNephrologist && (
                  <div>
                    <p className="font-medium text-zinc-500">Nephrologi</p>
                    <p className="text-lg">{center.panelNephrologist}</p>
                  </div>
                )}

                {center.centreManager && (
                  <div>
                    <p className="font-medium text-zinc-500">Pengurusan</p>
                    <p className="text-lg">{center.centreManager}</p>
                  </div>
                )}

                {center.centreCoordinator && (
                  <div>
                    <p className="font-medium text-zinc-500">Koordinator</p>
                    <p className="text-lg">{center.centreCoordinator}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="h-96 md:h-full min-h-[400px] bg-gray-100 rounded-lg overflow-hidden">
            {center.latitude && center.longitude && (
              <div className="h-full w-full">
                <SingleCenterMap
                  center={
                    [center.longitude, center.latitude] as [number, number]
                  }
                  name={center.dialysisCenterName}
                />
              </div>
            )}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">
            Kelebihan {center.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((benefit, index) => (
              <div
                key={index}
                className="border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-medium mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed CTA Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                {center.dialysisCenterName}
              </h3>
              <p className="text-sm text-muted-foreground">{shortAddress}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
                asChild
              >
                <a href={`tel:${center.phoneNumber}`}>
                  <Phone className="w-5 h-5 text-primary-foreground" />
                  <span className="text-primary-foreground">
                    Hubungi Sekarang
                  </span>
                </a>
              </Button>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
                asChild
                onClick={() =>
                  (window.location.href = `https://wa.me/+6${center.phoneNumber.replace(
                    /[\s-]/g,
                    ""
                  )}?text=Assalamualaikum%2FSalam%20sejahtera%2C%0A%0AUntuk%20tujuan%20pendaftaran%2Fperkhidmatan%20dialisis%2C%20mohon%20isikan%20maklumat%20berikut%3A%0A%0A%F0%9F%A7%A1%EF%B8%8F%20Nama%20Pesakit%3A%0A%0A%F0%9F%93%9E%20Nombor%20Telefon%3A%0A%0A%F0%9F%86%95%20Jenis%20Pesakit%3A%0A(Sila%20pilih%20satu%3A%20Pesakit%20Baru%20%2F%20Tumpang%20Sementara)%0A%0A%F0%9F%8F%A0%20Tempat%20Tinggal%20(Alamat%20Ringkas)%3A%0A%0AContoh%20jawapan%3A%0A%0AAhmad%20bin%20Ali%0A%0A012-3456789%0A%0ATumpang%20Sementara%0A%0ATaman%20Maju%2C%20Parit%20Raja%0A%0ATerima%20kasih%20atas%20kerjasama.`)
                }
              >
                <div>
                  <Image
                    src="/whatsapp.svg"
                    alt="WhatsApp"
                    width={20}
                    height={20}
                  />
                  <span className="text-primary-foreground">WhatsApp</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
