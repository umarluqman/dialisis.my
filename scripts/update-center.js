// Script to update the dialysis center with a value for the new drInChargeTel column
const { PrismaClient } = require("@prisma/client");
const { createClient } = require("@libsql/client");
const { PrismaLibSQL } = require("@prisma/adapter-libsql");
require("dotenv").config();

// Create the Prisma client with Turso adapter
const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const adapter = new PrismaLibSQL(libsql);
const prisma = new PrismaClient({ adapter });

async function updateCenter() {
  try {
    // Update the dialysis center with a value for drInChargeTel
    const updatedCenter = await prisma.dialysisCenter.update({
      where: { slug: "pusat-dialisis-kokitab" },
      data: {
        drInChargeTel: "019-8336196", // Using part of the phone number as the doctor's direct line
      },
      include: {
        state: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log("Successfully updated dialysis center:");
    console.log(JSON.stringify(updatedCenter, null, 2));
  } catch (error) {
    console.error("Error updating dialysis center:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
updateCenter();
