import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/constants";

// POST /api/admin/users/[id]/assign-centers - Assign centers to user
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { centerIds } = body;

    if (!Array.isArray(centerIds)) {
      return NextResponse.json(
        { error: "centerIds must be an array" },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify all centers exist
    const centers = await prisma.dialysisCenter.findMany({
      where: {
        id: {
          in: centerIds,
        },
      },
    });

    if (centers.length !== centerIds.length) {
      return NextResponse.json(
        { error: "One or more centers not found" },
        { status: 400 }
      );
    }

    // Remove existing assignments for this user
    await prisma.centerOwnership.updateMany({
      where: {
        userId: params.id,
      },
      data: {
        isActive: false,
      },
    });

    // Create new assignments
    const assignments = await Promise.all(
      centerIds.map((centerId: string) =>
        prisma.centerOwnership.upsert({
          where: {
            userId_dialysisCenterId: {
              userId: params.id,
              dialysisCenterId: centerId,
            },
          },
          update: {
            isActive: true,
            assignedBy: session.user.id,
            assignedAt: new Date(),
          },
          create: {
            userId: params.id,
            dialysisCenterId: centerId,
            assignedBy: session.user.id,
            isActive: true,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      assignments: assignments.length,
      message: `Successfully assigned ${assignments.length} centers to user`,
    });
  } catch (error) {
    console.error("Error assigning centers:", error);
    return NextResponse.json(
      { error: "Failed to assign centers" },
      { status: 500 }
    );
  }
}