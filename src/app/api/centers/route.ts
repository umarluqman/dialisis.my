import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";

// Schema for creating a new center
const createCenterSchema = z.object({
  dialysisCenterName: z.string().min(1, "Center name is required"),
  sector: z.string().default("Private"),
  drInCharge: z.string().default(""),
  address: z.string().default(""),
  addressWithUnit: z.string().default(""),
  tel: z.string().default(""),
  fax: z.string().optional().nullable(),
  panelNephrologist: z.string().optional().nullable(),
  centreManager: z.string().optional().nullable(),
  centreCoordinator: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  hepatitisBay: z.string().optional().nullable(),
  longitude: z.number().optional().nullable(),
  latitude: z.number().optional().nullable(),
  phoneNumber: z.string().default(""),
  website: z.string().optional().nullable(),
  title: z.string().default(""),
  units: z.string().default(""),
  stateId: z.string().min(1, "State is required"),
  town: z.string().default(""),
});

export async function GET() {
  try {
    const centers = await prisma.dialysisCenter.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        dialysisCenterName: true,
        latitude: true,
        longitude: true,
        addressWithUnit: true,
        state: {
          select: {
            name: true,
          },
        },
        town: true,
        tel: true,
        website: true,
        email: true,
        units: true,
        hepatitisBay: true,
        sector: true,
      },
    });

    return NextResponse.json(centers);
  } catch (error) {
    console.error("Error fetching centers:", error);
    return NextResponse.json(
      { error: "Failed to fetch centers" },
      { status: 500 }
    );
  }
}

// POST - Create a new center (authenticated business owners only)
export async function POST(request: Request) {
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
        { error: "Business owner profile not found" },
        { status: 403 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validatedData = createCenterSchema.parse(body);
    
    // Create the new center
    const newCenter = await prisma.dialysisCenter.create({
      data: {
        ...validatedData,
        ownerId: businessOwner.id,
      },
      include: {
        state: true,
      },
    });
    
    return NextResponse.json(newCenter, { status: 201 });
  } catch (error) {
    console.error("Error creating center:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create center" },
      { status: 500 }
    );
  }
}
