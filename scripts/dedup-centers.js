const fs = require("fs");

// Read the JSON file
const rawData = fs.readFileSync("data/updated_all_dialysis_centers.json");
const data = JSON.parse(rawData);

// Function to extract unit from dialysisCenterName
function extractUnit(name) {
  const parts = name.split(",");
  return parts.length > 1 ? parts[1].trim() : null;
}

// Function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Function to deduplicate centers
function dedupCenters(centers, threshold = 0.1) {
  const uniqueCenters = [];
  const seen = new Set();

  centers.forEach((center) => {
    const key = `${center.longitude},${center.latitude}`;

    // Find existing center within threshold distance
    const existingCenter = uniqueCenters.find(
      (uniqueCenter) =>
        calculateDistance(
          center.latitude,
          center.longitude,
          uniqueCenter.latitude,
          uniqueCenter.longitude
        ) < threshold
    );

    if (existingCenter) {
      // Add unit to existing center
      const unit = extractUnit(center.dialysisCenterName);
      if (unit) {
        if (!existingCenter.units) {
          existingCenter.units = [
            extractUnit(existingCenter.dialysisCenterName),
          ];
        }
        if (!existingCenter.units.includes(unit)) {
          existingCenter.units.push(unit);
        }
      }
    } else if (!seen.has(key)) {
      // Add new center with unit
      const unit = extractUnit(center.dialysisCenterName);
      if (unit) {
        center.units = [unit];
      }
      uniqueCenters.push(center);
      seen.add(key);
    }
  });

  return uniqueCenters;
}

// Deduplicate centers for each state
for (const state in data) {
  if (Array.isArray(data[state])) {
    console.log(`Deduplicating centers in ${state}...`);
    data[state] = dedupCenters(data[state]);
  }
}

// Write the deduplicated data back to a new JSON file
fs.writeFileSync(
  "data/deduplicated_dialysis_centers.json",
  JSON.stringify(data, null, 2)
);

console.log(
  "Deduplication complete. Results saved to deduplicated_dialysis_centers.json"
);
