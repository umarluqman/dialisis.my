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
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "name" TEXT,
    "password" TEXT,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
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
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UserDialysisCenter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "dialysisCenterId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'OWNER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserDialysisCenter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserDialysisCenter_dialysisCenterId_fkey" FOREIGN KEY ("dialysisCenterId") REFERENCES "DialysisCenter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
CREATE INDEX "Contact_email_idx" ON "Contact"("email");

-- CreateIndex
CREATE INDEX "Contact_ipAddress_idx" ON "Contact"("ipAddress");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "UserDialysisCenter_userId_idx" ON "UserDialysisCenter"("userId");

-- CreateIndex
CREATE INDEX "UserDialysisCenter_dialysisCenterId_idx" ON "UserDialysisCenter"("dialysisCenterId");

-- CreateIndex
CREATE UNIQUE INDEX "UserDialysisCenter_userId_dialysisCenterId_key" ON "UserDialysisCenter"("userId", "dialysisCenterId");
