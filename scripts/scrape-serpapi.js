const fs = require("fs");
const path = require("path");
const { getJson } = require("serpapi");

const API_KEY =
  "a9cb2a0033d1103943181ca0a4480d6eb04eb1b9e5c49a3de95f882ee542a5a5"; // Replace with your actual SerpApi key

async function scrapeDialysisCenters() {
  let allResults = [];
  let start = 0;
  const maxResults = 100; // Maximum recommended results

  try {
    while (allResults.length < maxResults) {
      const response = await getJson("google_maps", {
        api_key: API_KEY,
        q: "pusat dialisis OR dialysis center OR hemodialysis center OR pusat hemodialisis OR dialysis OR haemodialysis OR hemodialisis OR nephrocare",
        ll: "@3.1390,101.6869,8z",
        type: "search",
        hl: "en",
        num: 20,
        start: start,
      });

      const results = response.local_results || [];
      if (results.length === 0) break; // No more results

      const dialysisCenters = results.map((center) => ({
        name: center.title,
        latitude: center.gps_coordinates?.latitude,
        longitude: center.gps_coordinates?.longitude,
        address: center.address,
        phone: center.phone,
        website: center.website,
        email: center.email,
        operatingHours: center.operating_hours,
      }));

      allResults = allResults.concat(dialysisCenters);
      start += 20; // Move to the next page

      if (allResults.length >= maxResults) {
        allResults = allResults.slice(0, maxResults);
        break;
      }
    }

    const outputPath = path.join(
      __dirname,
      "..",
      "data",
      "gmb",
      "malaysia.json"
    );
    fs.writeFileSync(outputPath, JSON.stringify(allResults, null, 2));

    console.log(
      `Scraped and saved ${allResults.length} dialysis centers to malaysia.json`
    );
  } catch (error) {
    console.error("Error scraping data:", error);
  }
}

scrapeDialysisCenters();
