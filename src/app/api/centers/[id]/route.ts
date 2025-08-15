import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

// Schema for center updates
const updateCenterSchema = z.object({
  dialysisCenterName: z.string().optional(),
  sector: z.string().optional(),
  drInCharge: z.string().optional(),
  address: z.string().optional(),
  addressWithUnit: z.string().optional(),
  tel: z.string().optional(),
  fax: z.string().optional().nullable(),
  panelNephrologist: z.string().optional().nullable(),
  centreManager: z.string().optional().nullable(),
  centreCoordinator: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  hepatitisBay: z.string().optional().nullable(),
  longitude: z.number().optional().nullable(),
  latitude: z.number().optional().nullable(),
  phoneNumber: z.string().optional(),
  website: z.string().optional().nullable(),
  title: z.string().optional(),
  units: z.string().optional(),
  stateId: z.string().optional(),
  town: z.string().optional(),
});

// GET - Get a single center (public or owner)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    const center = await prisma.dialysisCenter.findUnique({
      where: { id: params.id },
      include: {
        state: true,
        owner: session?.user ? true : false,
      },
    });
    
    if (!center) {
      return NextResponse.json(
        { error: "Center not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(center);
  } catch (error) {
    console.error("Error fetching center:", error);
    return NextResponse.json(
      { error: "Failed to fetch center" },
      { status: 500 }
    );
  }
}

// PUT - Update a center (owner only)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get business owner
    const businessOwner = await prisma.businessOwner.findUnique({
      where: { userId: session.user.id },
    });
    
    if (!businessOwner) {
      return NextResponse.json(
        { error: "Business owner not found" },
        { status: 403 }
      );
    }
    
    // Check if the center belongs to this owner
    const existingCenter = await prisma.dialysisCenter.findUnique({
      where: { id: params.id },
    });
    
    if (!existingCenter) {
      return NextResponse.json(
        { error: "Center not found" },
        { status: 404 }
      );
    }
    
    if (existingCenter.ownerId !== businessOwner.id && session.user.role !== "admin") {
      return NextResponse.json(
        { error: "You don't have permission to edit this center" },
        { status: 403 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateCenterSchema.parse(body);
    
    // Update the center
    const updatedCenter = await prisma.dialysisCenter.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        state: true,
      },
    });
    
    return NextResponse.json(updatedCenter);
  } catch (error) {
    console.error("Error updating center:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update center" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a center (owner only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get business owner
    const businessOwner = await prisma.businessOwner.findUnique({
      where: { userId: session.user.id },
    });
    
    if (!businessOwner) {
      return NextResponse.json(
        { error: "Business owner not found" },
        { status: 403 }
      );
    }
    
    // Check if the center belongs to this owner
    const existingCenter = await prisma.dialysisCenter.findUnique({
      where: { id: params.id },
    });
    
    if (!existingCenter) {
      return NextResponse.json(
        { error: "Center not found" },
        { status: 404 }
      );
    }
    
    if (existingCenter.ownerId !== businessOwner.id && session.user.role !== "admin") {
      return NextResponse.json(
        { error: "You don't have permission to delete this center" },
        { status: 403 }
      );
    }
    
    // Delete the center
    await prisma.dialysisCenter.delete({
      where: { id: params.id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting center:", error);
    return NextResponse.json(
      { error: "Failed to delete center" },
      { status: 500 }
    );
  }
}