import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import sharp from "sharp";

// S3 client configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const BUCKET_URL = process.env.AWS_S3_BUCKET_URL;

export interface ImageProcessingOptions {
  original: { maxWidth: 1920, maxHeight: 1080, quality: 95 };
  optimized: { maxWidth: 1200, maxHeight: 800, quality: 85 };
  thumbnail: { maxWidth: 400, maxHeight: 300, quality: 80 };
}

export interface ProcessedImage {
  original: { url: string; key: string; size: number };
  optimized: { url: string; key: string; size: number };
  thumbnail: { url: string; key: string; size: number };
  dimensions: string;
}

// Upload and process image with multiple resolutions
export async function uploadAndProcessImage(
  file: File,
  centerId: string,
  uploadedBy?: string
): Promise<ProcessedImage> {
  const fileBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(fileBuffer);
  
  // Generate unique filename
  const timestamp = Date.now();
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const baseFilename = `${timestamp}`;
  
  // Process images in different sizes
  const [originalImage, optimizedImage, thumbnailImage] = await Promise.all([
    sharp(buffer)
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 95 })
      .toBuffer(),
    sharp(buffer)
      .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer(),
    sharp(buffer)
      .resize(400, 300, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer()
  ]);

  // Get dimensions of the optimized image
  const metadata = await sharp(optimizedImage).metadata();
  const dimensions = `${metadata.width}x${metadata.height}`;

  // Upload all versions to S3
  const uploadPromises = [
    {
      key: `dialysis-centers/${centerId}/original/${baseFilename}.jpg`,
      buffer: originalImage,
      type: 'original'
    },
    {
      key: `dialysis-centers/${centerId}/optimized/${baseFilename}.jpg`,
      buffer: optimizedImage,
      type: 'optimized'
    },
    {
      key: `dialysis-centers/${centerId}/thumbnails/${baseFilename}.jpg`,
      buffer: thumbnailImage,
      type: 'thumbnail'
    }
  ].map(async ({ key, buffer, type }) => {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: 'image/jpeg',
        ACL: 'public-read',
      },
    });

    await upload.done();
    
    return {
      type,
      url: `${BUCKET_URL}/${key}`,
      key,
      size: buffer.length
    };
  });

  const results = await Promise.all(uploadPromises);
  
  return {
    original: results.find(r => r.type === 'original')!,
    optimized: results.find(r => r.type === 'optimized')!,
    thumbnail: results.find(r => r.type === 'thumbnail')!,
    dimensions
  };
}

// Delete image from S3
export async function deleteImageFromS3(s3Key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
  });

  await s3Client.send(command);
}

// Upload default image
export async function uploadDefaultImage(
  file: File,
  category: string,
  altText: string
): Promise<{ url: string; key: string; size: number }> {
  const fileBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(fileBuffer);
  
  // Process image
  const processedBuffer = await sharp(buffer)
    .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 90 })
    .toBuffer();

  const timestamp = Date.now();
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const key = `defaults/${category}/${timestamp}.jpg`;

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: processedBuffer,
      ContentType: 'image/jpeg',
      ACL: 'public-read',
    },
  });

  await upload.done();

  return {
    url: `${BUCKET_URL}/${key}`,
    key,
    size: processedBuffer.length
  };
}

// Get default images for a center based on type/location
export function getDefaultImagesForCenter(centerType?: string, state?: string): string[] {
  // This would be enhanced with actual logic based on center characteristics
  const defaultImages = [
    `${BUCKET_URL}/defaults/general/default-1.jpg`,
    `${BUCKET_URL}/defaults/general/default-2.jpg`,
    `${BUCKET_URL}/defaults/general/default-3.jpg`,
  ];
  
  return defaultImages;
}