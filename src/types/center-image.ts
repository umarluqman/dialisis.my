export interface CenterImage {
  id: string;
  url: string;
  s3Key: string;
  altText: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  dialysisCenterId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ImageUploadResponse {
  message: string;
  images: CenterImage[];
}

export interface ImagesResponse {
  images: CenterImage[];
}

