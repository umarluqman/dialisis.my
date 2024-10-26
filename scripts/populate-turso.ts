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

  const states = Object.entries(jsonData);

  for (const [stateName, centers] of states) {
    try {
      // Get the state
      const state = await prisma.state.findUnique({
        where: { name: stateName },
      });

      if (!state) {
        console.log(`State ${stateName} not found, skipping...`);
        continue;
      }

      // Update dialysis centers for the state
      const centersArray = centers as any[];
      for (let i = 0; i < centersArray.length; i++) {
        const center = centersArray[i];

        try {
          await prisma.dialysisCenter.updateMany({
            where: {
              dialysisCenterName: center.dialysisCenterName,
              stateId: state.id,
            },
            data: {
              town: center.town || "",
              address: center.address || "",
            },
          });

          // Add a small delay between operations
          await delay(100);

          if (i % 5 === 0) {
            console.log(
              `Updated ${i + 1}/${centersArray.length} centers for ${stateName}`
            );
          }
        } catch (error) {
          console.error(
            `Error updating center ${center.dialysisCenterName}:`,
            error
          );
          continue;
        }
      }

      console.log(`Completed updating data for ${stateName}`);
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
