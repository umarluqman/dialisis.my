const fs = require("fs").promises;
const fetch = require("node-fetch");

const SERPER_API_KEY = "187c2d580e69d3ecb4ec6934c1fe4f091fafa100"; // Replace with your actual API key

async function fetchCenterDetails(centerName, state) {
  const searchParams = {
    q: centerName,
    location: `${state}, Malaysia`,
    gl: "my",
  };

  const response = await fetch("https://google.serper.dev/places", {
    method: "POST",
    headers: {
      "X-API-KEY": SERPER_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(searchParams),
  });

  const data = await response.json();
  return data.places[0] || {};
}

async function updateCentersData() {
  try {
    const fileContent = await fs.readFile(
      "data/all_dialysis_centers.json",
      "utf8"
    );
    const centersData = JSON.parse(fileContent);

    for (const state in centersData) {
      console.log(`Processing ${state}...`);
      for (const center of centersData[state]) {
        const centerDetails = await fetchCenterDetails(
          center.dialysisCenterName,
          state
        );

        // Update center information
        center.longitude = centerDetails.longitude || center.longitude;
        center.latitude = centerDetails.latitude || center.latitude;
        center.phoneNumber = centerDetails.phoneNumber || center.tel;
        center.website = centerDetails.website || center.website;
        center.address = centerDetails.address || center.address;
        center.title = centerDetails.title || center.dialysisCenterName;

        console.log(`Updated: ${center.dialysisCenterName}`);
      }
    }

    // Write updated data back to file
    await fs.writeFile(
      "data/updated_all_dialysis_centers.json",
      JSON.stringify(centersData, null, 2)
    );
    console.log("All centers updated successfully!");
  } catch (error) {
    console.error("Error updating centers:", error);
  }
}

updateCentersData();
