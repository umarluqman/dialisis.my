import { prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

const ITEMS_PER_PAGE = 20;
const MAX_SEARCH_TOKENS = 6;

// Map treatment params to DB unit values
const TREATMENT_TO_UNIT_MAP = {
  hemodialisis: "HD unit",
  MRRB: "MRRB unit",
  transplant: "TX Unit",
  "peritoneal dialisis": "PD Unit",
} as const;

function getSearchTokens(rawValue?: string | null) {
  if (!rawValue) return [];

  const normalized = rawValue.trim().replace(/\s+/g, " ");
  if (!normalized) return [];

  const seen = new Set<string>();
  const tokens: string[] = [];

  for (const chunk of normalized.split(/[^\p{L}\p{N}]+/u)) {
    const token = chunk.trim();
    if (!token) continue;

    const key = token.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    tokens.push(token);

    if (tokens.length >= MAX_SEARCH_TOKENS) break;
  }

  return tokens;
}

function buildFlexibleSearchConditions(
  rawValue?: string | null,
  doctorOnly = false
): Prisma.DialysisCenterWhereInput[] {
  const tokens = getSearchTokens(rawValue);
  if (!tokens.length) return [];

  const tokenFilters = tokens.map((token) => {
    const phoneToken = token.replace(/[^\d]/g, "");
    const tokenConditions: Prisma.DialysisCenterWhereInput[] = doctorOnly
      ? [
          { drInCharge: { contains: token } },
          { panelNephrologist: { contains: token } },
        ]
      : [
          { dialysisCenterName: { contains: token } },
          { title: { contains: token } },
          { drInCharge: { contains: token } },
          { panelNephrologist: { contains: token } },
          { town: { contains: token } },
          { address: { contains: token } },
          { addressWithUnit: { contains: token } },
        ];

    if (phoneToken.length >= 3) {
      tokenConditions.push(
        { phoneNumber: { contains: phoneToken } },
        { tel: { contains: phoneToken } },
        { drInChargeTel: { contains: phoneToken } }
      );
    }

    return { OR: tokenConditions };
  });

  return [{ AND: tokenFilters }];
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Extract filter values
    const page = Number(searchParams.get("page")) || 1;
    const drInCharge = searchParams.get("drInCharge");
    const doctor = searchParams.get("doctor");
    const town = searchParams.get("town");
    const name = searchParams.get("name");
    const query = searchParams.get("q") ?? searchParams.get("query");
    const treatment = searchParams.get("treatment");
    const state = searchParams.get("state");
    const sector = searchParams.get("sector");

    const generalSearchValue = query ?? name;
    const doctorSearchValue = doctor ?? drInCharge;
    const andConditions: Prisma.DialysisCenterWhereInput[] = [
      ...buildFlexibleSearchConditions(generalSearchValue),
      ...buildFlexibleSearchConditions(doctorSearchValue, true),
      ...(town
        ? [
            {
              OR: [
                { town: { contains: town } },
                { address: { contains: town } },
                { addressWithUnit: { contains: town } },
                { dialysisCenterName: { contains: town } },
                { title: { contains: town } },
              ],
            },
          ]
        : []),
    ];

    const where: Prisma.DialysisCenterWhereInput = {
      ...(andConditions.length > 0 ? { AND: andConditions } : {}),
    };

    if (treatment) {
      const unitValue =
        TREATMENT_TO_UNIT_MAP[treatment as keyof typeof TREATMENT_TO_UNIT_MAP];
      if (unitValue) {
        where.units = {
          contains: unitValue,
        };
      }
    }

    if (state) {
      where.state = {
        name: {
          contains: state,
        },
      };
    }

    if (sector) {
      where.sector =
        sector === "MOH_PRIVATE"
          ? {
              in: ["MOH", "PRIVATE"],
            }
          : {
              contains: sector,
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
