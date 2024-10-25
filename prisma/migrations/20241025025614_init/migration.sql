-- CreateTable
CREATE TABLE "DialysisCenter" (
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
    CONSTRAINT "DialysisCenter_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "State" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "DialysisCenter_sector_idx" ON "DialysisCenter"("sector");

-- CreateIndex
CREATE INDEX "DialysisCenter_title_idx" ON "DialysisCenter"("title");

-- CreateIndex
CREATE UNIQUE INDEX "State_name_key" ON "State"("name");
