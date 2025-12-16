// Script to remove random suffixes from dialysis center slugs
// Fixes Google Search Console "Duplicate, Google chose different canonical than user" issue
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

// Only process these specific slugs from Google Search Console CSV
// These are the 19 URLs flagged with "Duplicate, Google chose different canonical than user"
const targetSlugs = [
  "sjam-kps-pusat-hemodialisis-pulau-sebang-station-9-jalan-bandar-satelit-sebang-4-alor-gajah-melaka-ic0o0s",
  "tenang-haemodialysis-jasin-qnd2ja",
  "simpang-empat-dialysis-centre-ggsd4x",
  "yayasan-toh-puan-zurina-huzjtg",
  "sinar-haemodialysis-sdn-bhd-jasin-melaka-n4g3qf",
  "nephcare-dialysis-centre-selandar-cqh95b",
  "pusat-hemodialisis-suria-tampin-ja0ysn",
  "jasin-hospital-weawlx",
  "pusat-hemodialisis-suria-hq-0dws9m",
  "labuan-nucleus-hospital-j9kv5d",
  "unit-cara-kerja-hospital-melaka-rbd3up",
  "haemodialysis-yakin-prima-jaya-axgn9y",
  "fresenius-kidney-care-pusat-dialisis-nephrocare-bukit-piatu-a1rke2",
  "alor-gajah-hospital-5zwdr2",
  "ams-haemodialysis-unit-pusat-hemodialisis-ams-ti84wq",
  "pusat-dialisis-orion-consortium-xs5dwp",
  "sinar-haemodialysis-sdn-bhd-caw-malim-6sb7q0",
  "pusat-dialisis-davita-masjid-tanah-jyv50v",
  "pusat-dialisis-davita-batu-berendam-x0jal5",
];

// Pattern to match random suffixes at end of slug
// These are 6-character alphanumeric IDs that contain BOTH letters and numbers
const suffixPattern = /-([a-z0-9]{6})$/;

function cleanSlug(slug) {
  return slug.replace(suffixPattern, "");
}

function isTargetSlug(slug) {
  return targetSlugs.includes(slug);
}

async function removeSlugSuffixes() {
  console.log("🔍 Fetching all dialysis centers...\n");

  try {
    // Get all centers with their slugs
    const centers = await prisma.dialysisCenter.findMany({
      select: {
        id: true,
        slug: true,
        dialysisCenterName: true,
      },
    });

    console.log(`Found ${centers.length} total centers\n`);

    // Find centers matching the target slugs from Google Search Console
    const centersWithSuffixes = centers.filter((c) => isTargetSlug(c.slug));
    console.log(`Found ${centersWithSuffixes.length} of ${targetSlugs.length} target slugs from Google Search Console:\n`);

    if (centersWithSuffixes.length === 0) {
      console.log("✅ No centers with suffixes found. Nothing to update.");
      return;
    }

    // Build list of changes
    const changes = centersWithSuffixes.map((center) => ({
      id: center.id,
      oldSlug: center.slug,
      newSlug: cleanSlug(center.slug),
      name: center.dialysisCenterName,
    }));

    // Check for potential duplicates after cleaning
    const newSlugs = changes.map((c) => c.newSlug);
    const existingSlugs = centers.map((c) => c.slug);
    const duplicates = [];

    for (const change of changes) {
      // Check if new slug already exists (excluding current center)
      const existingWithNewSlug = centers.find(
        (c) => c.slug === change.newSlug && c.id !== change.id
      );
      if (existingWithNewSlug) {
        duplicates.push({
          newSlug: change.newSlug,
          conflictsWith: existingWithNewSlug.dialysisCenterName,
          center: change.name,
        });
      }

      // Check for duplicates within our changes
      const duplicateInChanges = changes.filter(
        (c) => c.newSlug === change.newSlug && c.id !== change.id
      );
      if (duplicateInChanges.length > 0) {
        duplicates.push({
          newSlug: change.newSlug,
          conflictsWith: duplicateInChanges.map((d) => d.name).join(", "),
          center: change.name,
        });
      }
    }

    // Print changes preview
    console.log("📋 Changes to be made:\n");
    console.log("=".repeat(80));
    changes.forEach((change, i) => {
      console.log(`${i + 1}. ${change.name}`);
      console.log(`   OLD: ${change.oldSlug}`);
      console.log(`   NEW: ${change.newSlug}`);
      console.log("");
    });

    // If duplicates found, abort
    if (duplicates.length > 0) {
      console.log("\n❌ ERROR: Duplicate slugs detected after cleaning!\n");
      duplicates.forEach((dup) => {
        console.log(`   "${dup.newSlug}" would conflict:`);
        console.log(`   - ${dup.center}`);
        console.log(`   - ${dup.conflictsWith}`);
      });
      console.log("\nAborting to prevent data corruption.");
      return;
    }

    // Check for --dry-run flag
    const isDryRun = process.argv.includes("--dry-run");
    if (isDryRun) {
      console.log("\n🏃 DRY RUN MODE - No changes will be made.\n");
      console.log("Run without --dry-run to apply changes.");
      return;
    }

    // Apply changes
    console.log("\n🔄 Applying changes...\n");

    for (const change of changes) {
      await prisma.dialysisCenter.update({
        where: { id: change.id },
        data: { slug: change.newSlug },
      });
      console.log(`✅ Updated: ${change.oldSlug} → ${change.newSlug}`);
    }

    console.log(`\n✅ Successfully updated ${changes.length} slugs!`);
    console.log("\n📝 Next steps:");
    console.log("1. Test that new URLs work: https://dialisis.my/<new-slug>");
    console.log("2. Old URLs will now 404 (expected)");
    console.log("3. Request re-indexing in Google Search Console");
    console.log("4. Optionally use URL Removal tool for old URLs");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
removeSlugSuffixes();
