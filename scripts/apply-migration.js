// Script to apply migration directly to Turso database
const { createClient } = require("@libsql/client");
require("dotenv").config();

// Create the Turso client
const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function applyMigration() {
  try {
    console.log("Checking if drInChargeTel column exists...");

    // Check if the column already exists
    const checkResult = await client.execute(`
      SELECT COUNT(*) as count
      FROM pragma_table_info('DialysisCenter')
      WHERE name = 'drInChargeTel'
    `);

    const columnExists = checkResult.rows[0].count > 0;

    if (columnExists) {
      console.log("Column drInChargeTel already exists. No migration needed.");
      return;
    }

    console.log("Adding drInChargeTel column to DialysisCenter table...");

    // Add the column
    await client.execute(`
      ALTER TABLE "DialysisCenter" 
      ADD COLUMN "drInChargeTel" TEXT NOT NULL DEFAULT ''
    `);

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Error applying migration:", error);
  } finally {
    await client.close();
  }
}

// Run the function
applyMigration();
