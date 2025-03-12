// Script to verify that the new dialysis center was added correctly
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

async function verifyCenter() {
  try {
    const center = await prisma.dialysisCenter.findUnique({
      where: { slug: "pusat-dialisis-kokitab" },
      include: {
        state: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log("Retrieved dialysis center:");
    console.log(JSON.stringify(center, null, 2));
  } catch (error) {
    console.error("Error retrieving dialysis center:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
verifyCenter();
