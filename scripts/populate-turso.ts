import { prisma } from "@/lib/db";
import fs from "fs";
import path from "path";

// Helper function to delay execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const jsonData = JSON.parse(
    fs.readFileSync(
      path.join("data", "deduplicated_dialysis_centers.json"),
      "utf-8"
    )
  );

  // Filter out already processed states
  const processedStates = ["johor", "kedah", "kelantan", "kuala-lumpur"];
  const remainingStates = Object.entries(jsonData).filter(
    ([stateName]) => !processedStates.includes(stateName)
  );

  for (const [stateName, centers] of remainingStates) {
    try {
      // Create or find the state
      const state = await prisma.state.upsert({
        where: { name: stateName },
        update: {},
        create: { name: stateName },
      });

      // Create dialysis centers for the state
      const centersArray = centers as any[];
      for (let i = 0; i < centersArray.length; i++) {
        const center = centersArray[i];

        try {
          await prisma.dialysisCenter.create({
            data: {
              dialysisCenterName: center.dialysisCenterName,
              sector: center.sector,
              drInCharge: center.drInCharge,
              address: center.address,
              addressWithUnit: center.addressWithUnit,
              tel: center.tel,
              fax: center.fax || "",
              panelNephrologist: center.panelNephrologist,
              centreManager: center.centreManager,
              centreCoordinator: center.centreCoordinator,
              email: center.email,
              hepatitisBay: center.hepatitisBay,
              longitude: center.longitude,
              latitude: center.latitude,
              phoneNumber: center.phoneNumber,
              website: center.website,
              title: center.title,
              units: center.units?.join(",") || "",
              stateId: state.id,
            },
          });

          // Add a small delay between operations
          await delay(100);

          if (i % 5 === 0) {
            console.log(
              `Imported ${i + 1}/${
                centersArray.length
              } centers for ${stateName}`
            );
          }
        } catch (error) {
          console.error(
            `Error importing center ${center.dialysisCenterName}:`,
            error
          );
          continue;
        }
      }

      console.log(`Completed importing data for ${stateName}`);
    } catch (error) {
      console.error(`Error processing state ${stateName}:`, error);
      continue;
    }
  }
}

main()
  .catch((e) => {
    console.error("Main error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
