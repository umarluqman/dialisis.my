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
    CONSTRAINT "DialysisCenter_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DialysisCenter" ("address", "addressWithUnit", "centreCoordinator", "centreManager", "createdAt", "dialysisCenterName", "drInCharge", "email", "fax", "hepatitisBay", "id", "latitude", "longitude", "panelNephrologist", "phoneNumber", "sector", "stateId", "tel", "title", "units", "updatedAt", "website") SELECT "address", "addressWithUnit", "centreCoordinator", "centreManager", "createdAt", "dialysisCenterName", "drInCharge", "email", "fax", "hepatitisBay", "id", "latitude", "longitude", "panelNephrologist", "phoneNumber", "sector", "stateId", "tel", "title", "units", "updatedAt", "website" FROM "DialysisCenter";
DROP TABLE "DialysisCenter";
ALTER TABLE "new_DialysisCenter" RENAME TO "DialysisCenter";
CREATE INDEX "DialysisCenter_sector_idx" ON "DialysisCenter"("sector");
CREATE INDEX "DialysisCenter_title_idx" ON "DialysisCenter"("title");
CREATE INDEX "DialysisCenter_town_idx" ON "DialysisCenter"("town");
CREATE INDEX "DialysisCenter_units_idx" ON "DialysisCenter"("units");
CREATE INDEX "DialysisCenter_drInCharge_idx" ON "DialysisCenter"("drInCharge");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
