/**
 * Database queries for internal linking system
 */

import { prisma } from "@/lib/db";
import { posts } from "#velite";
import { getDbStateName, createLocationSlug } from "./location-utils";
import {
  parseTreatmentTypes,
  haversineDistance,
  mapTagsToTreatments,
} from "./internal-linking-utils";
import { NEIGHBORING_STATES } from "@/constants";

export interface RelatedCenter {
  id: string;
  slug: string;
  name: string;
  city: string;
  stateName: string;
  units: string | null;
  treatmentTypes: string[];
}

export interface NearbyCenter extends RelatedCenter {
  distance: number;
}

export interface RelatedBlogPost {
  slug: string;
  title: string;
  description: string;
  locale: string;
  tags: string[];
}

export interface LocationLink {
  name: string;
  slug: string;
  centerCount: number;
}

/**
 * Get related centers for a center page (same city/state, similar treatments)
 */
export async function getRelatedCenters(params: {
  excludeId: string;
  city: string;
  stateName: string;
  treatmentTypes: string[];
  limit?: number;
}): Promise<RelatedCenter[]> {
  const { excludeId, city, stateName, treatmentTypes, limit = 4 } = params;
  const dbStateName = getDbStateName(stateName);

  try {
    // Get centers from same city first
    const sameCityCenters = await prisma.dialysisCenter.findMany({
      where: {
        id: { not: excludeId },
        town: { contains: city },
        state: { name: { equals: dbStateName } },
      },
      select: {
        id: true,
        slug: true,
        dialysisCenterName: true,
        town: true,
        units: true,
        state: { select: { name: true } },
      },
      take: limit * 2,
    });

    // If not enough from same city, get from same state
    let additionalCenters: typeof sameCityCenters = [];
    if (sameCityCenters.length < limit) {
      additionalCenters = await prisma.dialysisCenter.findMany({
        where: {
          id: { not: excludeId },
          town: { not: { contains: city } },
          state: { name: { equals: dbStateName } },
        },
        select: {
          id: true,
          slug: true,
          dialysisCenterName: true,
          town: true,
          units: true,
          state: { select: { name: true } },
        },
        take: limit - sameCityCenters.length,
      });
    }

    const allCenters = [...sameCityCenters, ...additionalCenters];

    // Score and sort by relevance (treatment match priority)
    const scored = allCenters.map((center) => {
      const centerTreatments = parseTreatmentTypes(center.units);
      const matchScore = treatmentTypes.filter((t) =>
        centerTreatments.includes(t)
      ).length;
      const sameCityBonus = center.town.includes(city) ? 10 : 0;

      return {
        id: center.id,
        slug: center.slug,
        name: center.dialysisCenterName,
        city: center.town,
        stateName: center.state?.name || stateName,
        units: center.units,
        treatmentTypes: centerTreatments,
        score: matchScore + sameCityBonus,
      };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ score, ...center }) => center);
  } catch (error) {
    console.error("Error fetching related centers:", error);
    return [];
  }
}

/**
 * Get nearby centers by geographic distance
 */
export async function getNearbyCenters(params: {
  excludeId: string;
  latitude: number;
  longitude: number;
  city: string;
  stateName: string;
  radiusKm?: number;
  limit?: number;
}): Promise<NearbyCenter[]> {
  const {
    excludeId,
    latitude,
    longitude,
    city,
    stateName,
    radiusKm = 15,
    limit = 3,
  } = params;

  try {
    // Get candidates within a bounding box (rough filter before Haversine)
    const latDelta = radiusKm / 111; // ~111km per degree latitude
    const lonDelta = radiusKm / (111 * Math.cos((latitude * Math.PI) / 180));

    const candidates = await prisma.dialysisCenter.findMany({
      where: {
        id: { not: excludeId },
        latitude: {
          gte: latitude - latDelta,
          lte: latitude + latDelta,
        },
        longitude: {
          gte: longitude - lonDelta,
          lte: longitude + lonDelta,
        },
      },
      select: {
        id: true,
        slug: true,
        dialysisCenterName: true,
        town: true,
        units: true,
        latitude: true,
        longitude: true,
        state: { select: { name: true } },
      },
    });

    // Calculate actual distances and filter
    const withDistance = candidates
      .map((center) => ({
        id: center.id,
        slug: center.slug,
        name: center.dialysisCenterName,
        city: center.town,
        stateName: center.state?.name || stateName,
        units: center.units,
        treatmentTypes: parseTreatmentTypes(center.units),
        distance: haversineDistance(
          latitude,
          longitude,
          center.latitude!,
          center.longitude!
        ),
      }))
      .filter((c) => c.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);

    // If not enough nearby, fallback to same city
    if (withDistance.length < limit) {
      const fallback = await getRelatedCenters({
        excludeId,
        city,
        stateName,
        treatmentTypes: [],
        limit: limit - withDistance.length,
      });

      return [
        ...withDistance,
        ...fallback
          .filter((c) => !withDistance.some((w) => w.id === c.id))
          .map((c) => ({ ...c, distance: -1 })),
      ];
    }

    return withDistance;
  } catch (error) {
    console.error("Error fetching nearby centers:", error);
    return [];
  }
}

/**
 * Get related blog posts matching treatment types
 */
export function getRelatedBlogPosts(params: {
  treatmentTypes: string[];
  locale?: "ms" | "en";
  limit?: number;
  excludeSlug?: string;
}): RelatedBlogPost[] {
  const { treatmentTypes, locale, limit = 3, excludeSlug } = params;

  const filteredPosts = posts.filter((post) => {
    if (excludeSlug && post.slug === excludeSlug) return false;
    if (locale && post.locale !== locale) return false;
    return true;
  });

  // Score by treatment type match
  const scored = filteredPosts.map((post) => {
    const postTreatments = mapTagsToTreatments(post.tags || []);
    const matchScore =
      treatmentTypes.includes("all") || postTreatments.includes("all")
        ? 1
        : treatmentTypes.filter((t) => postTreatments.includes(t)).length;
    const featuredBonus = post.featured ? 5 : 0;

    return {
      slug: post.slug,
      title: post.title,
      description: post.description || "",
      locale: post.locale || "ms",
      tags: post.tags || [],
      score: matchScore + featuredBonus,
    };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ score, ...post }) => post);
}

/**
 * Get neighboring states/cities with center counts
 */
export async function getNeighboringLocations(
  stateName: string,
  cityName?: string
): Promise<LocationLink[]> {
  try {
    if (cityName) {
      // For city pages, get other cities in same state
      const dbStateName = getDbStateName(stateName);
      const cities = await prisma.dialysisCenter.groupBy({
        by: ["town"],
        where: {
          state: { name: { equals: dbStateName } },
          town: { not: { equals: cityName } },
        },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 6,
      });

      return cities.map((c) => ({
        name: c.town,
        slug: `/lokasi/${createLocationSlug(stateName)}/${createLocationSlug(c.town)}`,
        centerCount: c._count.id,
      }));
    }

    // For state pages, get neighboring states
    const neighbors = NEIGHBORING_STATES[stateName] || [];
    if (neighbors.length === 0) return [];

    const counts = await Promise.all(
      neighbors.map(async (neighbor) => {
        const dbName = getDbStateName(neighbor);
        const count = await prisma.dialysisCenter.count({
          where: { state: { name: { equals: dbName } } },
        });
        return { name: neighbor, count };
      })
    );

    return counts
      .filter((c) => c.count > 0)
      .map((c) => ({
        name: c.name,
        slug: `/lokasi/${createLocationSlug(c.name)}`,
        centerCount: c.count,
      }));
  } catch (error) {
    console.error("Error fetching neighboring locations:", error);
    return [];
  }
}

/**
 * Get top locations for blog posts to link to
 */
export async function getTopLocationsForBlog(params: {
  treatmentTypes: string[];
  limit?: number;
}): Promise<LocationLink[]> {
  const { treatmentTypes, limit = 5 } = params;

  try {
    // Get states with most centers
    const states = await prisma.dialysisCenter.groupBy({
      by: ["stateId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: limit,
    });

    const stateDetails = await prisma.state.findMany({
      where: { id: { in: states.map((s) => s.stateId) } },
      select: { id: true, name: true },
    });

    return states.map((s) => {
      const state = stateDetails.find((d) => d.id === s.stateId);
      const name = state?.name || "Unknown";
      return {
        name,
        slug: `/lokasi/${createLocationSlug(name)}`,
        centerCount: s._count.id,
      };
    });
  } catch (error) {
    console.error("Error fetching top locations:", error);
    return [];
  }
}
