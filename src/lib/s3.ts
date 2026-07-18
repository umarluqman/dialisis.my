import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import { getAwsCredentials, getAwsRegion } from "@/lib/aws";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: getAwsRegion(),
  credentials: async () => getAwsCredentials(),
  forcePathStyle: true, // Use path-style URLs to avoid SSL certificate issues
});

const BUCKET_NAME =
  process.env.S3_BUCKET_NAME || process.env.AWS_S3_BUCKET_NAME || "dialisis.my";

export interface UploadResult {
  url: string;
  key: string;
}

export interface ImageFile {
  buffer: Buffer;
  mimetype: string;
  originalName: string;
}

export async function uploadFileToS3({
  file,
  folder = "uploads",
  cacheControl = "private, max-age=0, no-store",
}: {
  file: ImageFile;
  folder?: string;
  cacheControl?: string;
}): Promise<UploadResult> {
  const timestamp = Date.now();
  const sanitizedName = file.originalName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const key = `${folder}/${timestamp}-${sanitizedName || "file"}`;

  try {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        CacheControl: cacheControl,
        Metadata: {
          originalName: file.originalName,
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    const result = await upload.done();

    return {
      url: `https://s3.${getAwsRegion()}.amazonaws.com/${BUCKET_NAME}/${key}`,
      key,
    };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to upload file: ${detail}`);
  }
}

/**
 * Upload an image to S3
 */
export async function uploadImageToS3(
  file: ImageFile,
  folder: string = "dialysis-centers"
): Promise<UploadResult> {
  return uploadFileToS3({
    file,
    folder,
    cacheControl: "max-age=31536000",
  });
}

/**
 * Delete an image from S3
 */
export async function deleteImageFromS3(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error("Error deleting from S3:", error);
    throw new Error("Failed to delete image");
  }
}

/**
 * Get a signed URL for secure access to a private image
 */
export async function getSignedImageUrl(
  key: string,
  expiresIn: number = 3600 // 1 hour
): Promise<string> {
  return getSignedFileUrl(key, expiresIn);
}

export async function getSignedFileUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw new Error("Failed to generate signed URL");
  }
}

/**
 * List all images for a specific dialysis center
 */
export async function listCenterImages(centerId: string): Promise<string[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: `dialysis-centers/${centerId}/`,
    });

    const response = await s3Client.send(command);

    return (
      response.Contents?.map(
        (obj) =>
          `https://s3.${getAwsRegion()}.amazonaws.com/${BUCKET_NAME}/${obj.Key}`
      ) || []
    );
  } catch (error) {
    console.error("Error listing center images:", error);
    throw new Error("Failed to list center images");
  }
}

/**
 * Upload multiple images for a dialysis center
 */
export async function uploadCenterImages(
  centerId: string,
  files: ImageFile[]
): Promise<UploadResult[]> {
  const uploadPromises = files.map((file) =>
    uploadImageToS3(file, `dialysis-centers/${centerId}`)
  );

  try {
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Error uploading center images:", error);
    throw new Error("Failed to upload center images");
  }
}

/**
 * Get the public URL for an image (for public buckets)
 */
export function getPublicImageUrl(key: string): string {
  return `https://s3.${getAwsRegion()}.amazonaws.com/${BUCKET_NAME}/${key}`;
}
