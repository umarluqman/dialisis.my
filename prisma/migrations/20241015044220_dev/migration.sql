-- CreateTable
CREATE TABLE "DialysisCenter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "town" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "drInCharge" TEXT NOT NULL,
    "email" TEXT NOT NULL,
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
CREATE INDEX "DialysisCenter_town_idx" ON "DialysisCenter"("town");

-- CreateIndex
CREATE UNIQUE INDEX "State_name_key" ON "State"("name");
