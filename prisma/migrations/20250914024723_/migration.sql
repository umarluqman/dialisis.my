-- CreateTable
CREATE TABLE "DialysisCenter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL DEFAULT '',
    "dialysisCenterName" TEXT NOT NULL DEFAULT '',
    "sector" TEXT NOT NULL DEFAULT '',
    "drInCharge" TEXT NOT NULL DEFAULT '',
    "drInChargeTel" TEXT NOT NULL DEFAULT '',
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
    "description" TEXT,
    "benefits" TEXT,
    "photos" TEXT,
    "videos" TEXT,
    "stateId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "town" TEXT NOT NULL DEFAULT '',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "DialysisCenter_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "State" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
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
    "dialysisCenterId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CenterImage_dialysisCenterId_fkey" FOREIGN KEY ("dialysisCenterId") REFERENCES "DialysisCenter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "DialysisCenter_slug_key" ON "DialysisCenter"("slug");

-- CreateIndex
CREATE INDEX "DialysisCenter_sector_idx" ON "DialysisCenter"("sector");

-- CreateIndex
CREATE INDEX "DialysisCenter_title_idx" ON "DialysisCenter"("title");

-- CreateIndex
CREATE INDEX "DialysisCenter_town_idx" ON "DialysisCenter"("town");

-- CreateIndex
CREATE INDEX "DialysisCenter_units_idx" ON "DialysisCenter"("units");

-- CreateIndex
CREATE INDEX "DialysisCenter_drInCharge_idx" ON "DialysisCenter"("drInCharge");

-- CreateIndex
CREATE INDEX "DialysisCenter_addressWithUnit_idx" ON "DialysisCenter"("addressWithUnit");

-- CreateIndex
CREATE INDEX "DialysisCenter_address_idx" ON "DialysisCenter"("address");

-- CreateIndex
CREATE INDEX "DialysisCenter_dialysisCenterName_idx" ON "DialysisCenter"("dialysisCenterName");

-- CreateIndex
CREATE INDEX "DialysisCenter_slug_idx" ON "DialysisCenter"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "State_name_key" ON "State"("name");

-- CreateIndex
CREATE INDEX "CenterImage_dialysisCenterId_idx" ON "CenterImage"("dialysisCenterId");

-- CreateIndex
CREATE INDEX "CenterImage_displayOrder_idx" ON "CenterImage"("displayOrder");

-- CreateIndex
CREATE INDEX "CenterImage_isActive_idx" ON "CenterImage"("isActive");

-- CreateIndex
CREATE INDEX "Contact_email_idx" ON "Contact"("email");

-- CreateIndex
CREATE INDEX "Contact_ipAddress_idx" ON "Contact"("ipAddress");
