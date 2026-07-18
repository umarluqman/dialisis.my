import assert from "node:assert/strict";
import { test } from "node:test";

import { buildCenterRevalidationPaths } from "./site-revalidation-paths.mjs";

test("buildCenterRevalidationPaths returns deduped public paths", () => {
  assert.deepEqual(
    buildCenterRevalidationPaths({
      slug: "kl-dialysis",
      stateName: "Kuala Lumpur",
      town: "Cheras",
    }),
    [
      "/",
      "/kl-dialysis",
      "/lokasi/kuala-lumpur",
      "/lokasi/kuala-lumpur/cheras",
      "/api/centers-map",
      "/sitemap.xml",
    ]
  );
});

test("buildCenterRevalidationPaths includes old slug and old location", () => {
  assert.deepEqual(
    buildCenterRevalidationPaths({
      slug: "new-center",
      oldSlug: "old-center",
      stateName: "Selangor",
      town: "Shah Alam",
      oldStateName: "Kuala Lumpur",
      oldTown: "Cheras",
    }),
    [
      "/",
      "/new-center",
      "/old-center",
      "/lokasi/selangor",
      "/lokasi/selangor/shah-alam",
      "/lokasi/kuala-lumpur",
      "/lokasi/kuala-lumpur/cheras",
      "/api/centers-map",
      "/sitemap.xml",
    ]
  );
});
