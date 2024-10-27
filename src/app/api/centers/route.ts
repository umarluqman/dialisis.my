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
        addressWithUnit: true,
        state: {
          select: {
            name: true,
          },
        },
        town: true,
      },
    });

    const formattedCenters = centers.map((center) => ({
      id: center.id,
      name: center.dialysisCenterName,
      latitude: center.latitude!,
      longitude: center.longitude!,
      address: center.addressWithUnit,
      state: center.state.name,
      city: center.town,
    }));

    return NextResponse.json(formattedCenters);
  } catch (error) {
    console.error("Error fetching centers:", error);
    return NextResponse.json(
      { error: "Failed to fetch centers" },
      { status: 500 }
    );
  }
}
