import { getCentersByState } from "@/lib/location-queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get("state");
    const town = searchParams.get("town");

    if (!state) {
      return NextResponse.json(
        { error: "State parameter is required" },
        { status: 400 }
      );
    }

    const centerData = await getCentersByState(state, town || undefined);

    return NextResponse.json({
      centers: centerData.centers,
      totalCenters: centerData.totalCenters,
    });
  } catch (error) {
    console.error("Error fetching centers by state:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
