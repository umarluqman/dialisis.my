import { prisma } from "@/lib/db";
import fs from "fs";
import path from "path";

async function main() {
  const dataDir = path.join(__dirname, "..", "data", "json");
  const stateFiles = ["perlis.json", "putrajaya.json"];

  for (const file of stateFiles) {
    const stateName = path.parse(file).name;
    const jsonData = JSON.parse(
      fs.readFileSync(path.join(dataDir, file), "utf-8")
    );

    // Create or find the state
    const state = await prisma.state.upsert({
      where: { name: stateName },
      update: {},
      create: { name: stateName },
    });

    // Create dialysis centers for the state
    for (const center of jsonData) {
      await prisma.dialysisCenter.create({
        data: {
          name: center.name,
          address: center.address,
          town: center.town || "",
          tel: center.tel,
          unit: center.addressWithUnit.split(", ").pop() || "",
          sector: center.sector,
          drInCharge: center.drInCharge,
          email: center.email,
          stateId: state.id,
        },
      });
    }

    console.log(`Imported data for ${stateName}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
