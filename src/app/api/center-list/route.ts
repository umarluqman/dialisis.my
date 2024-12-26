import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

const ITEMS_PER_PAGE = 20;

// Map treatment params to DB unit values
const TREATMENT_TO_UNIT_MAP = {
  hemodialisis: "HD unit",
  MRRB: "MRRB unit",
  transplant: "TX Unit",
  "peritoneal dialisis": "PD Unit",
} as const;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Extract filter values
    const page = Number(searchParams.get("page")) || 1;
    const drInCharge = searchParams.get("drInCharge");
    const town = searchParams.get("town");
    const dialysisCenterName = searchParams.get("dialysisCenterName");
    const treatment = searchParams.get("treatment");
    const state = searchParams.get("state");
    const sector = searchParams.get("sector");

    // Build where clause
    const where: any = {};

    if (drInCharge) {
      where.drInCharge = {
        contains: drInCharge,
        mode: "insensitive",
      };
    }

    if (town) {
      where.town = {
        contains: town,
        mode: "insensitive",
      };
    }

    if (dialysisCenterName) {
      where.dialysisCenterName = {
        contains: dialysisCenterName,
        mode: "insensitive",
      };
    }

    if (treatment) {
      const unitValue =
        TREATMENT_TO_UNIT_MAP[treatment as keyof typeof TREATMENT_TO_UNIT_MAP];
      if (unitValue) {
        where.units = {
          contains: unitValue,
          mode: "insensitive",
        };
      }
    }

    if (state) {
      where.state = {
        name: {
          contains: state,
          mode: "insensitive",
        },
      };
    }

    if (sector) {
      where.sector =
        sector === "MOH_PRIVATE"
          ? {
              in: ["MOH", "PRIVATE"],
              mode: "insensitive",
            }
          : {
              contains: sector,
              mode: "insensitive",
            };
    }

    // Fetch data with pagination
    const [centers, total] = await Promise.all([
      prisma.dialysisCenter.findMany({
        take: ITEMS_PER_PAGE,
        skip: (page - 1) * ITEMS_PER_PAGE,
        where,
        include: {
          state: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          dialysisCenterName: "asc",
        },
      }),
      prisma.dialysisCenter.count({ where }),
    ]);

    return NextResponse.json({
      centers,
      totalPages: Math.ceil(total / ITEMS_PER_PAGE),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching dialysis centers:", error);
    return NextResponse.json(
      { error: "Failed to fetch dialysis centers" },
      { status: 500 }
    );
  }
}
