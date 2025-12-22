import { prisma } from "@/lib/db";
import {
  deleteImageFromS3,
  getPublicImageUrl,
  uploadImageToS3,
} from "@/lib/s3";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

// GET - Fetch all images for a dialysis center
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const images = await prisma.centerImage.findMany({
      where: {
        dialysisCenterId: id,
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

    // Use public URLs for caching (S3 bucket must have public read policy)
    const imagesWithPublicUrls = images.map((image) => ({
      ...image,
      url: getPublicImageUrl(image.s3Key),
    }));

    return NextResponse.json(
      { images: imagesWithPublicUrls },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error("Error fetching center images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

// POST - Upload new images for a dialysis center
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Verify that the dialysis center exists
    const center = await prisma.dialysisCenter.findUnique({
      where: { id },
    });

    if (!center) {
      return NextResponse.json(
        { error: "Dialysis center not found" },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll("images") as File[];

    if (!files.length) {
      return NextResponse.json(
        { error: "No images provided" },
        { status: 400 }
      );
    }

    const uploadResults = [];

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        continue;
      }

      // Get buffer from file
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Optimize image with sharp
      const optimizedBuffer = await sharp(buffer)
        .resize(1200, 800, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({
          quality: 85,
          progressive: true,
        })
        .toBuffer();

      // Upload to S3
      const uploadResult = await uploadImageToS3(
        {
          buffer: optimizedBuffer,
          mimetype: "image/jpeg",
          originalName: file.name,
        },
        `dialysis-centers/${id}`
      );

      // Get the current max display order
      const maxOrder = await prisma.centerImage.findFirst({
        where: { dialysisCenterId: id },
        orderBy: { displayOrder: "desc" },
        select: { displayOrder: true },
      });

      const nextOrder = (maxOrder?.displayOrder || 0) + 1;

      // Save to database
      const savedImage = await prisma.centerImage.create({
        data: {
          url: uploadResult.url,
          s3Key: uploadResult.key,
          altText: `${center.dialysisCenterName} - Gallery Image`,
          dialysisCenterId: id,
          displayOrder: nextOrder,
        },
      });

      uploadResults.push(savedImage);
    }

    return NextResponse.json({
      message: `Successfully uploaded ${uploadResults.length} images`,
      images: uploadResults,
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    return NextResponse.json(
      { error: "Failed to upload images" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an image
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get("imageId");

    if (!imageId) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    // Get image details
    const image = await prisma.centerImage.findFirst({
      where: {
        id: imageId,
        dialysisCenterId: params.id,
      },
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Delete from S3
    await deleteImageFromS3(image.s3Key);

    // Delete from database
    await prisma.centerImage.delete({
      where: { id: imageId },
    });

    return NextResponse.json({
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
