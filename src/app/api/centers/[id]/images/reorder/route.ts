import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// PUT - Reorder images for a dialysis center
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { imageIds }: { imageIds: string[] } = await request.json();

    if (!imageIds || !Array.isArray(imageIds)) {
      return NextResponse.json(
        { error: "Invalid imageIds array" },
        { status: 400 }
      );
    }

    // Update display order for each image
    const updatePromises = imageIds.map((imageId, index) =>
      prisma.centerImage.update({
        where: {
          id: imageId,
          dialysisCenterId: id,
        },
        data: {
          displayOrder: index + 1,
        },
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({
      message: "Image order updated successfully",
    });
  } catch (error) {
    console.error("Error reordering images:", error);
    return NextResponse.json(
      { error: "Failed to reorder images" },
      { status: 500 }
    );
  }
}

