import { prisma } from "@/lib/db";
import { getDbStateName } from "./location-utils";

export interface LocationCenterData {
  centers: any[];
  totalCenters: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  stateName: string;
  cityName?: string;
}

interface StateQueryOptions {
  page?: number;
  pageSize?: number;
}

/**
 * Gets dialysis centers for a specific state, optionally filtered by town
 */
export async function getCentersByState(
  stateName: string,
  townName?: string,
  options?: StateQueryOptions
): Promise<LocationCenterData> {
  const dbStateName = getDbStateName(stateName);
  const page = options?.page && options.page > 0 ? options.page : 1;
  const pageSize =
    options?.pageSize && options.pageSize > 0 ? options.pageSize : 24;
  const skip = (page - 1) * pageSize;

  try {
    const baseWhere = {
      state: {
        name: {
          equals: dbStateName,
        },
      },
      ...(townName && {
        OR: [
          { town: { contains: townName } },
          { address: { contains: townName } },
          { addressWithUnit: { contains: townName } },
        ],
      }),
    };

    const [centers, totalCount] = await Promise.all([
      prisma.dialysisCenter.findMany({
        where: baseWhere,
        include: {
          state: {
            select: {
              name: true,
            },
          },
        },
        orderBy: [
          {
            featured: "desc",
          },
          {
            dialysisCenterName: "asc",
          },
        ],
        skip,
        take: pageSize,
      }),
      prisma.dialysisCenter.count({
        where: baseWhere,
      }),
    ]);

    // Transform state names back to display format
    const transformedCenters = centers.map((center: any) => ({
      ...center,
      state: center.state
        ? {
            ...center.state,
            name: center.state.name.replace(/-/g, " "),
          }
        : null,
    }));

    return {
      centers: transformedCenters,
      totalCenters: totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
      currentPage: page,
      pageSize,
      stateName,
    };
  } catch (error) {
    console.error("Error fetching centers by state:", error);
    return {
      centers: [],
      totalCenters: 0,
      totalPages: 1,
      currentPage: page,
      pageSize,
      stateName,
    };
  }
}

/**
 * Gets dialysis centers for a specific city within a state
 */
export async function getCentersByCity(
  stateName: string,
  cityName: string
): Promise<LocationCenterData> {
  const dbStateName = getDbStateName(stateName);

  try {
    const [centers, totalCount] = await Promise.all([
      prisma.dialysisCenter.findMany({
        where: {
          state: {
            name: {
              equals: dbStateName,
            },
          },
          OR: [
            { town: { contains: cityName } },
            { address: { contains: cityName } },
            { addressWithUnit: { contains: cityName } },
          ],
        },
        include: {
          state: {
            select: {
              name: true,
            },
          },
        },
        orderBy: [
          {
            featured: "desc",
          },
          {
            dialysisCenterName: "asc",
          },
        ],
      }),
      prisma.dialysisCenter.count({
        where: {
          state: {
            name: {
              equals: dbStateName,
            },
          },
          OR: [
            { town: { contains: cityName } },
            { address: { contains: cityName } },
            { addressWithUnit: { contains: cityName } },
          ],
        },
      }),
    ]);

    // Transform state names back to display format
    const transformedCenters = centers.map((center: any) => ({
      ...center,
      state: center.state
        ? {
            ...center.state,
            name: center.state.name.replace(/-/g, " "),
          }
        : null,
    }));

    return {
      centers: transformedCenters,
      totalCenters: totalCount,
      totalPages: 1,
      currentPage: 1,
      pageSize: totalCount || 1,
      stateName,
      cityName,
    };
  } catch (error) {
    console.error("Error fetching centers by city:", error);
    return {
      centers: [],
      totalCenters: 0,
      totalPages: 1,
      currentPage: 1,
      pageSize: 1,
      stateName,
      cityName,
    };
  }
}

/**
 * Gets statistics for a location (for SEO content)
 */
export async function getLocationStats(stateName: string, cityName?: string) {
  const dbStateName = getDbStateName(stateName);

  try {
    const baseWhere = {
      state: {
        name: {
          equals: dbStateName,
        },
      },
      ...(cityName && {
        OR: [
          { town: { contains: cityName } },
          { address: { contains: cityName } },
          { addressWithUnit: { contains: cityName } },
        ],
      }),
    };

    const [
      totalCenters,
      mohCenters,
      privateCenters,
      hemodialysisCenters,
      peritonealCenters,
      hepatitisBCenters,
      hepatitisCCenters,
    ] = await Promise.all([
      prisma.dialysisCenter.count({ where: baseWhere }),
      prisma.dialysisCenter.count({
        where: { ...baseWhere, sector: { equals: "MOH" } },
      }),
      prisma.dialysisCenter.count({
        where: { ...baseWhere, sector: { equals: "PRIVATE" } },
      }),
      prisma.dialysisCenter.count({
        where: { ...baseWhere, units: { contains: "HD Unit" } },
      }),
      prisma.dialysisCenter.count({
        where: { ...baseWhere, units: { contains: "PD Unit" } },
      }),
      prisma.dialysisCenter.count({
        where: {
          ...baseWhere,
          OR: [
            { hepatitisBay: { contains: "Hep B" } },
            { hepatitisBay: { contains: "Hepatitis B" } },
          ],
        },
      }),
      prisma.dialysisCenter.count({
        where: {
          ...baseWhere,
          OR: [
            { hepatitisBay: { contains: "Hep C" } },
            { hepatitisBay: { contains: "Hepatitis C" } },
          ],
        },
      }),
    ]);

    return {
      totalCenters,
      mohCenters,
      privateCenters,
      hemodialysisCenters,
      peritonealCenters,
      hepatitisBCenters,
      hepatitisCCenters,
    };
  } catch (error) {
    console.error("Error fetching location stats:", error);
    return {
      totalCenters: 0,
      mohCenters: 0,
      privateCenters: 0,
      hemodialysisCenters: 0,
      peritonealCenters: 0,
      hepatitisBCenters: 0,
      hepatitisCCenters: 0,
    };
  }
}
