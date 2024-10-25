const fs = require("fs");

// Read the JSON file
const rawData = fs.readFileSync("data/all_dialysis_centers.json");
const data = JSON.parse(rawData);

// Process each state
for (const state in data) {
  data[state] = data[state].map((center) => {
    // Replace newlines and multiple spaces with a single space
    center.dialysisCenterName = center.dialysisCenterName
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return center;
  });
}

// Write the processed data back to a new JSON file
fs.writeFileSync(
  "data/processed_dialysis_centers.json",
  JSON.stringify(data, null, 2)
);

console.log(
  "Processing complete. Output saved to processed_dialysis_centers.json"
);
