-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'BUSINESS_OWNER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CenterOwnership" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "dialysisCenterId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,
    CONSTRAINT "CenterOwnership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CenterOwnership_dialysisCenterId_fkey" FOREIGN KEY ("dialysisCenterId") REFERENCES "DialysisCenter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserSubscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "billingCycle" TEXT NOT NULL DEFAULT 'MONTHLY',
    "centerCount" INTEGER NOT NULL DEFAULT 0,
    "basePrice" INTEGER NOT NULL,
    "bulkDiscount" INTEGER NOT NULL DEFAULT 0,
    "finalPrice" INTEGER NOT NULL,
    "customPricing" BOOLEAN NOT NULL DEFAULT false,
    "currentPeriodStart" DATETIME NOT NULL,
    "currentPeriodEnd" DATETIME NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "chipSubscriptionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subscriptionId" TEXT NOT NULL,
    "chipPaymentId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'MYR',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT NOT NULL,
    "billingCycle" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Payment_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "UserSubscription" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PricingTier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tier" TEXT NOT NULL,
    "billingCycle" TEXT NOT NULL,
    "basePrice" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BulkDiscount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "minCenters" INTEGER NOT NULL,
    "maxCenters" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CenterAnalytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dialysisCenterId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "phoneClicks" INTEGER NOT NULL DEFAULT 0,
    "whatsappClicks" INTEGER NOT NULL DEFAULT 0,
    "emailClicks" INTEGER NOT NULL DEFAULT 0,
    "websiteClicks" INTEGER NOT NULL DEFAULT 0,
    "mapClicks" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "CenterAnalytics_dialysisCenterId_fkey" FOREIGN KEY ("dialysisCenterId") REFERENCES "DialysisCenter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CenterImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,
    "altText" TEXT NOT NULL DEFAULT '',
    "description" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "imageType" TEXT NOT NULL DEFAULT 'CUSTOM',
    "fileSize" INTEGER,
    "dimensions" TEXT,
    "uploadedBy" TEXT,
    "dialysisCenterId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CenterImage_dialysisCenterId_fkey" FOREIGN KEY ("dialysisCenterId") REFERENCES "DialysisCenter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DefaultImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "s3Key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DialysisCenter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dialysisCenterName" TEXT NOT NULL DEFAULT '',
    "sector" TEXT NOT NULL DEFAULT '',
    "drInCharge" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "addressWithUnit" TEXT NOT NULL DEFAULT '',
    "tel" TEXT NOT NULL DEFAULT '',
    "fax" TEXT,
    "panelNephrologist" TEXT,
    "centreManager" TEXT,
    "centreCoordinator" TEXT,
    "email" TEXT,
    "hepatitisBay" TEXT,
    "longitude" REAL,
    "latitude" REAL,
    "phoneNumber" TEXT NOT NULL DEFAULT '',
    "website" TEXT,
    "title" TEXT NOT NULL DEFAULT '',
    "units" TEXT NOT NULL DEFAULT '',
    "stateId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "town" TEXT NOT NULL DEFAULT '',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "DialysisCenter_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DialysisCenter" ("address", "addressWithUnit", "centreCoordinator", "centreManager", "createdAt", "dialysisCenterName", "drInCharge", "email", "fax", "hepatitisBay", "id", "latitude", "longitude", "panelNephrologist", "phoneNumber", "sector", "stateId", "tel", "title", "town", "units", "updatedAt", "website") SELECT "address", "addressWithUnit", "centreCoordinator", "centreManager", "createdAt", "dialysisCenterName", "drInCharge", "email", "fax", "hepatitisBay", "id", "latitude", "longitude", "panelNephrologist", "phoneNumber", "sector", "stateId", "tel", "title", "town", "units", "updatedAt", "website" FROM "DialysisCenter";
DROP TABLE "DialysisCenter";
ALTER TABLE "new_DialysisCenter" RENAME TO "DialysisCenter";
CREATE INDEX "DialysisCenter_sector_idx" ON "DialysisCenter"("sector");
CREATE INDEX "DialysisCenter_title_idx" ON "DialysisCenter"("title");
CREATE INDEX "DialysisCenter_town_idx" ON "DialysisCenter"("town");
CREATE INDEX "DialysisCenter_units_idx" ON "DialysisCenter"("units");
CREATE INDEX "DialysisCenter_drInCharge_idx" ON "DialysisCenter"("drInCharge");
CREATE INDEX "DialysisCenter_isPremium_idx" ON "DialysisCenter"("isPremium");
CREATE INDEX "DialysisCenter_featured_idx" ON "DialysisCenter"("featured");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE INDEX "CenterOwnership_userId_idx" ON "CenterOwnership"("userId");

-- CreateIndex
CREATE INDEX "CenterOwnership_dialysisCenterId_idx" ON "CenterOwnership"("dialysisCenterId");

-- CreateIndex
CREATE UNIQUE INDEX "CenterOwnership_userId_dialysisCenterId_key" ON "CenterOwnership"("userId", "dialysisCenterId");

-- CreateIndex
CREATE INDEX "UserSubscription_userId_idx" ON "UserSubscription"("userId");

-- CreateIndex
CREATE INDEX "UserSubscription_status_idx" ON "UserSubscription"("status");

-- CreateIndex
CREATE INDEX "UserSubscription_tier_idx" ON "UserSubscription"("tier");

-- CreateIndex
CREATE INDEX "UserSubscription_currentPeriodEnd_idx" ON "UserSubscription"("currentPeriodEnd");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_chipPaymentId_key" ON "Payment"("chipPaymentId");

-- CreateIndex
CREATE INDEX "Payment_subscriptionId_idx" ON "Payment"("subscriptionId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_chipPaymentId_idx" ON "Payment"("chipPaymentId");

-- CreateIndex
CREATE INDEX "PricingTier_tier_idx" ON "PricingTier"("tier");

-- CreateIndex
CREATE INDEX "PricingTier_isActive_idx" ON "PricingTier"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "PricingTier_tier_billingCycle_key" ON "PricingTier"("tier", "billingCycle");

-- CreateIndex
CREATE INDEX "BulkDiscount_minCenters_maxCenters_idx" ON "BulkDiscount"("minCenters", "maxCenters");

-- CreateIndex
CREATE INDEX "BulkDiscount_isActive_idx" ON "BulkDiscount"("isActive");

-- CreateIndex
CREATE INDEX "CenterAnalytics_dialysisCenterId_idx" ON "CenterAnalytics"("dialysisCenterId");

-- CreateIndex
CREATE INDEX "CenterAnalytics_date_idx" ON "CenterAnalytics"("date");

-- CreateIndex
CREATE UNIQUE INDEX "CenterAnalytics_dialysisCenterId_date_key" ON "CenterAnalytics"("dialysisCenterId", "date");

-- CreateIndex
CREATE INDEX "CenterImage_dialysisCenterId_idx" ON "CenterImage"("dialysisCenterId");

-- CreateIndex
CREATE INDEX "CenterImage_displayOrder_idx" ON "CenterImage"("displayOrder");

-- CreateIndex
CREATE INDEX "CenterImage_isActive_idx" ON "CenterImage"("isActive");

-- CreateIndex
CREATE INDEX "CenterImage_imageType_idx" ON "CenterImage"("imageType");

-- CreateIndex
CREATE UNIQUE INDEX "DefaultImage_s3Key_key" ON "DefaultImage"("s3Key");

-- CreateIndex
CREATE INDEX "DefaultImage_category_idx" ON "DefaultImage"("category");

-- CreateIndex
CREATE INDEX "DefaultImage_isActive_idx" ON "DefaultImage"("isActive");

-- CreateIndex
CREATE INDEX "DefaultImage_displayOrder_idx" ON "DefaultImage"("displayOrder");
