/**
 * Utility functions for internal linking system
 */

const TREATMENT_ANCHOR_MAP: Record<string, Record<string, string>> = {
  hd: { ms: "hemodialisis", en: "hemodialysis" },
  pd: { ms: "peritoneal dialisis", en: "peritoneal dialysis" },
  tx: { ms: "transplant buah pinggang", en: "kidney transplant" },
};

/**
 * Parse treatment types from units string (e.g., "HD Unit, PD Unit")
 */
export function parseTreatmentTypes(units: string | null): string[] {
  if (!units) return [];

  const types: string[] = [];
  const lowerUnits = units.toLowerCase();

  if (lowerUnits.includes("hd")) types.push("hd");
  if (lowerUnits.includes("pd")) types.push("pd");
  if (lowerUnits.includes("tx")) types.push("tx");
  if (lowerUnits.includes("mrrb")) types.push("mrrb");

  return types;
}

/**
 * Calculate Haversine distance between two coordinates in kilometers
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Map blog tags to treatment types
 */
export function mapTagsToTreatments(tags: string[]): string[] {
  if (!tags || tags.length === 0) return ["all"];

  const treatments: string[] = [];
  const lowerTags = tags.map((t) => t.toLowerCase());

  if (lowerTags.some((t) => t.includes("hemodial") || t === "hd")) {
    treatments.push("hd");
  }
  if (
    lowerTags.some((t) => t.includes("peritoneal") || t === "pd" || t === "capd")
  ) {
    treatments.push("pd");
  }
  if (lowerTags.some((t) => t.includes("transplant"))) {
    treatments.push("tx");
  }

  return treatments.length > 0 ? treatments : ["all"];
}

/**
 * Generate SEO-friendly anchor text for center links
 */
export function generateCenterAnchorText(
  centerName: string,
  city: string,
  treatmentType?: string,
  locale: "ms" | "en" = "ms"
): string {
  const shortName = centerName.split(",")[0].trim();
  const treatment = treatmentType
    ? TREATMENT_ANCHOR_MAP[treatmentType]?.[locale]
    : null;

  if (treatment) {
    return locale === "ms"
      ? `${shortName} - ${capitalize(treatment)} di ${city}`
      : `${shortName} - ${capitalize(treatment)} in ${city}`;
  }

  return locale === "ms"
    ? `${shortName} - Pusat Dialisis di ${city}`
    : `${shortName} - Dialysis Center in ${city}`;
}

/**
 * Generate anchor text for location links
 */
export function generateLocationAnchorText(
  stateName: string,
  cityName?: string,
  locale: "ms" | "en" = "ms"
): string {
  if (cityName) {
    return locale === "ms"
      ? `Pusat dialisis di ${cityName}, ${stateName}`
      : `Dialysis centers in ${cityName}, ${stateName}`;
  }
  return locale === "ms"
    ? `Pusat dialisis di ${stateName}`
    : `Dialysis centers in ${stateName}`;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Check if two centers offer similar treatment types
 */
export function hasSimilarTreatments(
  treatments1: string[],
  treatments2: string[]
): boolean {
  return treatments1.some((t) => treatments2.includes(t));
}
