import { NextResponse } from "next/server";
import { getCurrentUser, checkDialysisCenterPermission } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const dialysisCenter = await prisma.dialysisCenter.findUnique({
      where: { id: params.id },
      include: {
        state: true,
        users: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!dialysisCenter) {
      return NextResponse.json(
        { error: "Dialysis center not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(dialysisCenter);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dialysis center" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const permissions = await checkDialysisCenterPermission(params.id, user.id);
    if (!permissions.canEdit) {
      return NextResponse.json(
        { error: "You don't have permission to edit this dialysis center" },
        { status: 403 }
      );
    }

    const data = await request.json();
    
    const updatedCenter = await prisma.dialysisCenter.update({
      where: { id: params.id },
      data: {
        dialysisCenterName: data.dialysisCenterName,
        sector: data.sector,
        drInCharge: data.drInCharge,
        drInChargeTel: data.drInChargeTel,
        address: data.address,
        addressWithUnit: data.addressWithUnit,
        tel: data.tel,
        fax: data.fax,
        email: data.email,
        town: data.town,
        stateId: data.stateId,
        panelNephrologist: data.panelNephrologist,
        centreManager: data.centreManager,
        centreCoordinator: data.centreCoordinator,
        hepatitisBay: data.hepatitisBay,
        website: data.website,
        description: data.description,
        benefits: data.benefits,
        longitude: data.longitude,
        latitude: data.latitude,
      },
      include: {
        state: true,
      },
    });

    return NextResponse.json(updatedCenter);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update dialysis center" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const permissions = await checkDialysisCenterPermission(params.id, user.id);
    if (!permissions.canDelete) {
      return NextResponse.json(
        { error: "You don't have permission to delete this dialysis center" },
        { status: 403 }
      );
    }

    await prisma.dialysisCenter.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Dialysis center deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete dialysis center" },
      { status: 500 }
    );
  }
}