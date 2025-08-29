"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";

interface CenterCardGalleryProps {
  images: Array<{
    src: string;
    alt: string;
  }>;
  centerName: string;
}

export function CenterCardGallery({ images, centerName }: CenterCardGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsDialogOpen(true);
  };

  const handlePrevious = useCallback(() => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  }, [selectedImageIndex]);

  const handleNext = useCallback(() => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  }, [selectedImageIndex, images.length]);

  // Touch handlers for swipe gestures in lightbox
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrevious();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isDialogOpen) return;
      
      if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "Escape") {
        setIsDialogOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDialogOpen, handlePrevious, handleNext]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      {/* Gallery Carousel */}
      <div className="relative w-full mb-4">
        <Carousel
          opts={{
            align: "start",
            loop: false,
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-3">
            {images.map((image, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-3 basis-4/5 sm:basis-3/4 md:basis-2/3 lg:basis-3/4">
                <div
                  className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => handleImageClick(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleImageClick(index);
                    }
                  }}
                  aria-label={`View ${image.alt || `image ${index + 1}`} in fullscreen`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt || `${centerName} - Gambar ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 80vw, (max-width: 768px) 75vw, 66vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Expand className="h-3.5 w-3.5 text-white" />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 1 && (
            <>
              <CarouselPrevious className="left-1 md:left-2 h-7 w-7 md:h-8 md:w-8 bg-white/90 hover:bg-white shadow-md" />
              <CarouselNext className="right-1 md:right-2 h-7 w-7 md:h-8 md:w-8 bg-white/90 hover:bg-white shadow-md" />
            </>
          )}
        </Carousel>
        
        {/* Dot indicators for mobile */}
        {images.length > 1 && (
          <div className="flex justify-center gap-1 mt-2 md:hidden">
            {images.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  index === 0 ? "w-3 bg-primary" : "w-1 bg-zinc-300"
                )}
                aria-label={`Image ${index + 1} of ${images.length}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[100vw] md:max-w-[95vw] max-h-[100vh] md:max-h-[95vh] p-0 bg-black/95 border-none">
          <div 
            className="relative w-full h-full flex items-center justify-center"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {selectedImageIndex !== null && (
              <>
                {/* Close button */}
                <DialogClose className="absolute top-3 right-3 md:top-4 md:right-4 z-50 rounded-full bg-white/10 backdrop-blur-sm p-2 hover:bg-white/20 transition-colors">
                  <X className="h-4 w-4 md:h-5 md:w-5 text-white" />
                  <span className="sr-only">Close gallery</span>
                </DialogClose>

                {/* Previous button - hidden on mobile, visible on desktop */}
                {selectedImageIndex > 0 && (
                  <button
                    onClick={handlePrevious}
                    className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/10 backdrop-blur-sm p-2 hover:bg-white/20 transition-colors items-center justify-center"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6 text-white" />
                  </button>
                )}

                {/* Next button - hidden on mobile, visible on desktop */}
                {selectedImageIndex < images.length - 1 && (
                  <button
                    onClick={handleNext}
                    className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/10 backdrop-blur-sm p-2 hover:bg-white/20 transition-colors items-center justify-center"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6 text-white" />
                  </button>
                )}

                {/* Main image */}
                <div className="relative w-full h-[calc(100vh-100px)] md:h-[80vh] flex items-center justify-center px-2 md:px-4">
                  <Image
                    src={images[selectedImageIndex].src}
                    alt={images[selectedImageIndex].alt || `${centerName} - Gambar ${selectedImageIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 95vw"
                    priority
                  />
                </div>

                {/* Image counter and mobile navigation dots */}
                <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                  <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-white text-xs md:text-sm font-medium">
                      {selectedImageIndex + 1} / {images.length}
                    </span>
                  </div>
                  
                  {/* Mobile swipe hint */}
                  <div className="md:hidden text-white/60 text-xs">
                    Swipe untuk navigasi
                  </div>
                </div>

                {/* Mobile navigation buttons at bottom */}
                <div className="md:hidden absolute bottom-12 left-0 right-0 flex justify-between px-4">
                  {selectedImageIndex > 0 && (
                    <button
                      onClick={handlePrevious}
                      className="rounded-full bg-white/10 backdrop-blur-sm p-2 transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5 text-white" />
                    </button>
                  )}
                  <div className="flex-1" />
                  {selectedImageIndex < images.length - 1 && (
                    <button
                      onClick={handleNext}
                      className="rounded-full bg-white/10 backdrop-blur-sm p-2 transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5 text-white" />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}