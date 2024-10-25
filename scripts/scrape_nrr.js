const fs = require("fs");
const cheerio = require("cheerio");
const path = require("path");

// Get the absolute path to the data directory
const dataDir = path.join(__dirname, "..", "data", "html");

// Function to extract text and trim whitespace
const extractText = (element) => element.text().trim();

// Function to scrape a single HTML file
function scrapeHtmlFile(filePath) {
  const html = fs.readFileSync(filePath, "utf8");
  const $ = cheerio.load(html);
  const dialysisCenters = [];

  $('tr[id^="DRow_"]:not([id$="_header"])').each((index, row) => {
    const $row = $(row);
    const $detailRow = $row.next('tr[style="display:none"]');

    if ($detailRow.length) {
      const $detailContainer = $detailRow.find(".detailContainer");

      const center = {
        dialysisCenterName: extractText($row.find("a")),
        sector: extractText($row.find("td:nth-child(2)")),
        drInCharge: extractText($row.find("td:nth-child(3)")),
        address: $detailContainer
          .contents()
          .filter((_, el) => el.nodeType === 3)
          .map((_, el) => $(el).text().trim())
          .get()
          .join(" ")
          .replace(/\s+/g, " ")
          .trim(),
        addressWithUnit: $detailContainer
          .clone()
          .children()
          .remove()
          .end()
          .text()
          .trim()
          .replace(/\s+/g, " "),
        tel: $detailContainer
          .find('td:contains("Tel") + td')
          .map((_, el) => extractText($(el)))
          .get()
          .join(", "),
        fax: extractText($detailContainer.find('td:contains("Fax") + td')),
        panelNephrologist: extractText(
          $detailContainer.find('td:contains("Panel Nephrologist") + td')
        ),
        centreManager: extractText(
          $detailContainer.find('td:contains("Centre manager") + td')
        ),
        centreCoordinator: extractText(
          $detailContainer.find('td:contains("Centre Coordinator") + td')
        ),
        email: extractText($detailContainer.find('td:contains("Email") + td')),
        hepatitisBay: $detailContainer
          .find("h3 small")
          .text()
          .includes("Hep B Bay")
          ? "Hep B"
          : $detailContainer.find("h3 small").text().includes("Hep C Bay")
          ? "Hep C"
          : $detailContainer.find("h3 small").text().includes("Hep B+C Bay")
          ? "Hep B+C"
          : "",
        town: $row
          .prevAll('tr[id^="DRow_"]:not([id$="_header"]):not([id^="DRow_"])')
          .first()
          .find("td")
          .text()
          .split("-")?.[1]
          ?.trim(),
      };

      dialysisCenters.push(center);
    }
  });

  return dialysisCenters;
}

// Get all HTML files in the data directory
const htmlFiles = fs
  .readdirSync(dataDir)
  .filter((file) => file.endsWith(".html"));

// Scrape data from all HTML files
const allDialysisCenters = {};

htmlFiles.forEach((file) => {
  const state = path.parse(file).name;
  const filePath = path.join(dataDir, file);
  allDialysisCenters[state] = scrapeHtmlFile(filePath);
});

// Output the result
console.log(JSON.stringify(allDialysisCenters, null, 2));

// Save to a JSON file
fs.writeFileSync(
  path.join(__dirname, "..", "data", "all_dialysis_centers.json"),
  JSON.stringify(allDialysisCenters, null, 2)
);
