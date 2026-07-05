function createSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function addPath(paths, path) {
  if (path && !paths.includes(path)) {
    paths.push(path);
  }
}

function addLocationPaths(paths, stateName, town) {
  const stateSlug = createSlug(stateName);
  const townSlug = createSlug(town);

  if (!stateSlug) return;

  addPath(paths, `/lokasi/${stateSlug}`);

  if (townSlug) {
    addPath(paths, `/lokasi/${stateSlug}/${townSlug}`);
  }
}

export function buildCenterRevalidationPaths(input = {}) {
  const paths = ["/"];
  const slug = createSlug(input.slug);
  const oldSlug = createSlug(input.oldSlug);

  if (slug) addPath(paths, `/${slug}`);
  if (oldSlug && oldSlug !== slug) addPath(paths, `/${oldSlug}`);

  addLocationPaths(paths, input.stateName, input.town);
  addLocationPaths(paths, input.oldStateName, input.oldTown);

  addPath(paths, "/api/centers-map");
  addPath(paths, "/sitemap.xml");

  return paths;
}
