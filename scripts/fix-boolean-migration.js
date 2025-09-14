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

async function fixBooleanMigration() {
  try {
    console.log("🔄 Starting boolean migration for CenterImage.isActive field...");

    // Test the problematic query first
    const testCenter = "cm2o5h9jf00e4e9mbio2hpvjk";
    
    console.log("🧪 Testing queries...");
    
    // Test without boolean filter
    const allImages = await prisma.centerImage.findMany({
      where: { dialysisCenterId: testCenter },
      take: 5
    });
    console.log(`📸 Total images for test center: ${allImages.length}`);
    console.log("Sample isActive values:", allImages.map(img => ({ id: img.id, isActive: img.isActive, type: typeof img.isActive })));
    
    // Test with boolean filter
    const activeImages = await prisma.centerImage.findMany({
      where: { 
        dialysisCenterId: testCenter,
        isActive: true 
      },
    });
    console.log(`✅ Active images with boolean filter: ${activeImages.length}`);

    if (activeImages.length === 0 && allImages.length > 0) {
      console.log("🔧 Issue confirmed: Boolean filter not working");
      console.log("💡 Regenerating Prisma client...");
      
      // The main fix is usually regenerating the Prisma client
      console.log("Run these commands:");
      console.log("1. pnpm prisma generate");
      console.log("2. Restart your dev server");
      
    } else {
      console.log("🎉 Boolean filtering is working correctly!");
    }

    // Check database schema
    console.log("\n📋 Database schema check:");
    const schemaInfo = await libsql.execute(`
      SELECT name, type FROM pragma_table_info('CenterImage') WHERE name = 'isActive'
    `);
    
    if (schemaInfo.rows.length > 0) {
      console.log(`isActive column type: ${schemaInfo.rows[0].type}`);
    }

  } catch (error) {
    console.error("❌ Error during migration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
fixBooleanMigration();