// Script to add a new dialysis center to the database
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

// New dialysis center data
const newCenter = {
  dialysisCenterName: "Pusat Hemodialisis As-Salam - Cawangan Jelawat",
  address: "Lot 109 & 110, Mukim Rusa, Jelawat, 16070 Bachok, Kelantan",
  addressWithUnit: "Lot 109 & 110, Mukim Rusa, Jelawat, 16070 Bachok, Kelantan",
  sector: "PRIVATE",
  drInCharge: "",
  tel: "017-313 3168",
  fax: "",
  panelNephrologist: "",
  email: "",
  hepatitisBay: "",
  longitude: 102.3833579423281,
  latitude: 6.0107783114125155,
  phoneNumber: "017-313 3168",
  website: "",
  title: "Pusat Hemodialisis As-Salam - Cawangan Jelawat",
  town: "Bachok",
  stateId: "cm2o5gxi800bse9mbi5icmts5",
  units: "HD Unit",
  centreCoordinator: "",
  centreManager: "",
};

// Function to generate a slug from the dialysis center name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with a single hyphen
}

async function addDialysisCenter() {
  try {
    // Generate the slug
    const slug = generateSlug(newCenter.dialysisCenterName);

    // Check if a center with this slug already exists
    const existingCenter = await prisma.dialysisCenter.findUnique({
      where: { slug },
    });

    if (existingCenter) {
      console.log(
        `A center with the slug "${slug}" already exists. Adding a unique identifier.`
      );
      // Add a timestamp to make the slug unique
      const timestamp = Date.now().toString().slice(-4);
      newCenter.slug = `${slug}-${timestamp}`;
    } else {
      newCenter.slug = slug;
    }

    // Add the new dialysis center
    const result = await prisma.dialysisCenter.create({
      data: {
        ...newCenter,
        // Convert string coordinates to numbers
        longitude: parseFloat(newCenter.longitude),
        latitude: parseFloat(newCenter.latitude),
      },
      include: {
        state: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log("Successfully added new dialysis center:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error adding dialysis center:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
addDialysisCenter();
