const fs = require("fs");
const path = require("path");

function countDialysisCenters() {
  const dataPath = path.join(
    __dirname,
    "..",
    "data",
    "deduplicated_dialysis_centers.json"
  );
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  let totalCenters = 0;
  let centersPerState = {};

  for (const state in data) {
    const centerCount = data[state].length;
    totalCenters += centerCount;
    centersPerState[state] = centerCount;
  }

  console.log(`Total number of dialysis centers: ${totalCenters}`);
  console.log("\nCenters per state:");
  for (const state in centersPerState) {
    console.log(`${state}: ${centersPerState[state]}`);
  }
}

countDialysisCenters();
