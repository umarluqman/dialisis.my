// Script to convert slug to center ID
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

async function slugToId(slug) {
  try {
    const center = await prisma.dialysisCenter.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        dialysisCenterName: true,
        title: true,
      },
    });

    if (center) {
      console.log("✅ Found center:");
      console.log(`ID: ${center.id}`);
      console.log(`Slug: ${center.slug}`);
      console.log(`Name: ${center.dialysisCenterName}`);
      console.log(`Title: ${center.title}`);
      return center.id;
    } else {
      console.log(`❌ No center found with slug: ${slug}`);
      return null;
    }
  } catch (error) {
    console.error("Error finding center:", error);
    return null;
  }
}

async function listAllSlugs() {
  try {
    const centers = await prisma.dialysisCenter.findMany({
      select: {
        id: true,
        slug: true,
        dialysisCenterName: true,
      },
      orderBy: {
        dialysisCenterName: 'asc',
      },
    });

    console.log("\n📋 All centers with their slugs:");
    console.log("=".repeat(80));
    centers.forEach((center, index) => {
      console.log(`${index + 1}. ${center.dialysisCenterName}`);
      console.log(`   ID: ${center.id}`);
      console.log(`   Slug: ${center.slug}`);
      console.log("");
    });

    return centers;
  } catch (error) {
    console.error("Error listing centers:", error);
    return [];
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log("Usage: node scripts/slug-to-id.js <slug>");
    console.log("Or: node scripts/slug-to-id.js --list (to list all slugs)");
    return;
  }

  if (args[0] === "--list") {
    await listAllSlugs();
  } else {
    const slug = args[0];
    console.log(`�� Looking for center with slug: ${slug}`);
    await slugToId(slug);
  }

  await prisma.$disconnect();
}

// Run the script
main();
