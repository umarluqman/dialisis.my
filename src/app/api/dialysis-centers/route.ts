import { NextResponse } from "next/server";
import { getCurrentUser, createDialysisCenterForUser } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Generate slug from name
    const slug = data.dialysisCenterName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check if slug already exists
    const existingSlug = await prisma.dialysisCenter.findUnique({
      where: { slug },
    });

    const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

    const dialysisCenter = await createDialysisCenterForUser(user.id, {
      ...data,
      slug: finalSlug,
      title: data.dialysisCenterName, // Set title same as name initially
      units: data.units || "",
    });

    return NextResponse.json(dialysisCenter, { status: 201 });
  } catch (error) {
    console.error("Create error:", error);
    return NextResponse.json(
      { error: "Failed to create dialysis center" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user's dialysis centers
    const centers = await prisma.userDialysisCenter.findMany({
      where: { userId: user.id },
      include: {
        dialysisCenter: {
          include: {
            state: true,
          },
        },
      },
    });

    return NextResponse.json(centers.map(c => ({
      ...c.dialysisCenter,
      userRole: c.role,
    })));
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dialysis centers" },
      { status: 500 }
    );
  }
}