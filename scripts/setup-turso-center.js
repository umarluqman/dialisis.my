const { PrismaClient } = require("@prisma/client");
const { createClient } = require("@libsql/client");
const { PrismaLibSQL } = require("@prisma/adapter-libsql");
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
require("dotenv").config();

// Create the Prisma client with Turso adapter
const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const adapter = new PrismaLibSQL(libsql);
const prisma = new PrismaClient({ adapter });

// S3 client for listing images
const s3Client = new S3Client({
  region: 'ap-southeast-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Center data for cmcif6ham0001u66hs1c9hzxe
const centerData = {
  id: "cmcif6ham0001u66hs1c9hzxe",
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
  stateId: "cm2o5gxi800bse9mbi5icmts5", // Kelantan state ID
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

async function setupCenterWithImages() {
  try {
    console.log("Starting setup for center with images...");

    // First, check if we need to create the state
    let state = await prisma.state.findUnique({
      where: { id: centerData.stateId }
    });

    if (!state) {
      console.log("Creating Kelantan state...");
      state = await prisma.state.create({
        data: {
          id: centerData.stateId,
          name: "Kelantan"
        }
      });
      console.log("State created:", state.name);
    }

 sen    // Use the specific center ID
    const centerId = centerData.id;
    
    // Check if the center already exists
    let existingCenter = await prisma.dialysisCenter.findUnique({
      where: { id: centerId },
    });

    if (existingCenter) {
      console.log(`Center with ID "${centerId}" already exists. Using existing center.`);
    } else {
      console.log("Creating new dialysis center...");
      const slug = generateSlug(centerData.dialysisCenterName);
      const result = await prisma.dialysisCenter.create({
        data: {
          ...centerData,
          slug,
          // Convert string coordinates to numbers
          longitude: parseFloat(centerData.longitude),
          latitude: parseFloat(centerData.latitude),
        },
      });
      console.log("Center created with ID:", result.id);
    }

    // Now check for images in S3
    console.log("Checking for images in S3...");
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Prefix: `dialysis-centers/${centerId}/`
    });

    const s3Result = await s3Client.send(listCommand);
    
    if (!s3Result.Contents) {
      console.log("No images found in S3");
      return;
    }

    // Filter out the folder itself and get only image files
    const imageFiles = s3Result.Contents.filter(obj => 
      obj.Key !== `dialysis-centers/${centerId}/` && 
      obj.Size > 0
    );

    console.log(`Found ${imageFiles.length} images in S3`);

    // Get existing database records
    const existingImages = await prisma.centerImage.findMany({
      where: { dialysisCenterId: centerId }
    });

    console.log(`Found ${existingImages.length} existing database records`);

    // Find missing images
    const existingS3Keys = existingImages.map(img => img.s3Key);
    const missingImages = imageFiles.filter(obj => 
      !existingS3Keys.includes(obj.Key)
    );

    console.log(`Found ${missingImages.length} missing images`);

    if (missingImages.length === 0) {
      console.log('No missing images to add');
      return;
    }

    // Add missing images to database
    for (let i = 0; i < missingImages.length; i++) {
      const image = missingImages[i];
      const fileName = image.Key.split('/').pop();
      const displayOrder = existingImages.length + i + 1;

      const imageRecord = await prisma.centerImage.create({
        data: {
          url: `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}/${image.Key}`,
          s3Key: image.Key,
          altText: `${centerData.dialysisCenterName} - ${fileName}`,
          displayOrder,
          dialysisCenterId: centerId,
          isActive: true
        }
      });

      console.log(`Added: ${fileName} (ID: ${imageRecord.id})`);
    }

    console.log('Successfully completed setup!');
    console.log('Center ID:', centerId);
    console.log('Total images added:', missingImages.length);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupCenterWithImages();
