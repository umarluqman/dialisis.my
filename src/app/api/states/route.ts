import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  try {
    const states = await prisma.state.findMany({
      orderBy: {
        name: "asc",
      },
    });
    
    return NextResponse.json(states);
  } catch (error) {
    console.error("Error fetching states:", error);
    return NextResponse.json(
      { error: "Failed to fetch states" },
      { status: 500 }
    );
  }
}