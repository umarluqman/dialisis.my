import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

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
        address: true,
        addressWithUnit: true,
        state: {
          select: {
            name: true,
          },
        },
        town: true,
        tel: true,
        phoneNumber: true,
        website: true,
        email: true,
        units: true,
        hepatitisBay: true,
        sector: true,
        featured: true,
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
