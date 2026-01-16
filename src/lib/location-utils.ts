import { CITIES } from "@/constants";

export interface LocationData {
  state: string;
  stateSlug: string;
  cities: string[];
}

export interface LocationParams {
  state: string;
  city?: string;
}

/**
 * Converts a location name to URL-friendly slug
 */
export function createLocationSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Converts slug back to display name
 */
export function slugToDisplayName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Gets all location data with slugs for static generation
 */
export function getAllLocationData(): LocationData[] {
  const locationData: LocationData[] = [];

  // Process regular states and federal territories
  Object.entries(CITIES).forEach(([state, cities]) => {
    // Skip "Semua Negeri / Wilayah" as it's not a real state
    if (state === "Semua Negeri / Wilayah") return;

    // Handle federal territories mapping
    let actualState = state;
    if (state === "Wilayah Persekutuan") {
      // Skip this as we handle KL, Putrajaya, Labuan separately
      return;
    }

    locationData.push({
      state: actualState,
      stateSlug: createLocationSlug(actualState),
      cities: cities,
    });
  });

  // Add federal territories as separate states
  const federalTerritories = ["Kuala Lumpur", "Putrajaya", "Labuan"];
  federalTerritories.forEach((territory) => {
    const territoryKey =
      territory === "Kuala Lumpur" ? "Kuala Lumpur" : territory;
    const cities = CITIES[territoryKey] || [];

    locationData.push({
      state: territory,
      stateSlug: createLocationSlug(territory),
      cities: cities,
    });
  });

  return locationData;
}

/**
 * Generates all static params for states and cities
 */
export function generateAllLocationParams(): LocationParams[] {
  const params: LocationParams[] = [];
  const locationData = getAllLocationData();

  locationData.forEach(({ state, stateSlug, cities }) => {
    // Add state-level param
    params.push({
      state: stateSlug,
    });

    // Add city-level params
    cities.forEach((city) => {
      params.push({
        state: stateSlug,
        city: createLocationSlug(city),
      });
    });
  });

  return params;
}

/**
 * Gets display names from slugs
 */
export function getLocationDisplayNames(
  stateSlug: string,
  citySlug?: string
): {
  stateName: string;
  cityName?: string;
} {
  const locationData = getAllLocationData();
  const location = locationData.find((loc) => loc.stateSlug === stateSlug);

  if (!location) {
    return { stateName: slugToDisplayName(stateSlug) };
  }

  const stateName = location.state;

  if (!citySlug) {
    return { stateName };
  }

  const cityName =
    location.cities.find((city) => createLocationSlug(city) === citySlug) ||
    slugToDisplayName(citySlug);

  return { stateName, cityName };
}

/**
 * Gets the database state name format (lowercase with hyphens to match Turso data)
 */
export function getDbStateName(stateName: string): string {
  return stateName.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Gets all towns/cities for a specific state
 */
export function getTownsForState(stateName: string): string[] {
  const locationData = getAllLocationData();
  const location = locationData.find((loc) => loc.state === stateName);
  
  return location ? location.cities : [];
}

/**
 * Validates if a state/city combination exists
 */
export function validateLocation(
  stateSlug: string,
  citySlug?: string
): boolean {
  const locationData = getAllLocationData();
  const location = locationData.find((loc) => loc.stateSlug === stateSlug);

  if (!location) return false;

  if (!citySlug) return true;

  return location.cities.some((city) => createLocationSlug(city) === citySlug);
}








