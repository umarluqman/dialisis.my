"use client";

import { useState } from "react";
import { FeaturedCenterCard } from "./featured-center-card";
import { ImageViewer } from "./image-viewer";

interface FeaturedDialysisSectionProps {
  centers: Array<{
    id: string;
    dialysisCenterName: string;
    address?: string;
    tel?: string;
    email?: string;
    state: {
      name: string;
    };
    town: string;
    units?: string;
    hepatitisBay?: string;
    sector?: string;
    website?: string;
    photos?: string;
  }>;
}

export function FeaturedDialysisSection({ centers }: FeaturedDialysisSectionProps) {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedCenterName, setSelectedCenterName] = useState("");

  const handleImageClick = (centerName: string, photos: string[], index: number) => {
    setSelectedCenterName(centerName);
    setSelectedImages(photos);
    setSelectedImageIndex(index);
    setImageViewerOpen(true);
  };

  if (!centers.length) return null;

  return (
    <>
      <div className="bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-screen-xl mx-auto px-8">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Pusat Dialisis Pilihan
            </h2>
            <p className="text-gray-600">
              Pusat dialisis terpilih dengan kemudahan dan perkhidmatan terbaik
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {centers.map((center) => {
              let photos: string[] = [];
              try {
                photos = center.photos ? JSON.parse(center.photos) : [];
              } catch (e) {
                photos = [];
              }

              return (
                <FeaturedCenterCard
                  key={center.id}
                  id={center.id}
                  name={center.dialysisCenterName}
                  address={center.address}
                  tel={center.tel}
                  state={center.state.name}
                  city={center.town}
                  units={center.units}
                  hepatitisBay={center.hepatitisBay}
                  sector={center.sector}
                  photos={photos}
                  onImageClick={(index) => 
                    handleImageClick(center.dialysisCenterName, photos, index)
                  }
                />
              );
            })}
          </div>
        </div>
      </div>

      <ImageViewer
        images={selectedImages}
        initialIndex={selectedImageIndex}
        isOpen={imageViewerOpen}
        onClose={() => setImageViewerOpen(false)}
        title={selectedCenterName}
      />
    </>
  );
}