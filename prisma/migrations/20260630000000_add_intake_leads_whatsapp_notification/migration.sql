ALTER TABLE "DialysisCenter" ADD COLUMN "whatsappPicName" TEXT;
ALTER TABLE "DialysisCenter" ADD COLUMN "whatsappPicPhoneNumber" TEXT;
ALTER TABLE "DialysisCenter" ADD COLUMN "whatsappPicOptedInAt" DATETIME;
ALTER TABLE "DialysisCenter" ADD COLUMN "whatsappTemplateName" TEXT;
ALTER TABLE "DialysisCenter" ADD COLUMN "whatsappTemplateLanguageCode" TEXT DEFAULT 'ms';

CREATE TABLE "IntakeLead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dialysisCenterId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "myKadNumber" TEXT NOT NULL,
    "homeAddress" TEXT NOT NULL,
    "preferredDate" DATETIME NOT NULL,
    "preferredSession" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "labResultUrl" TEXT,
    "labResultS3Key" TEXT,
    "labResultOriginalName" TEXT,
    "additionalNotes" TEXT,
    "consentAt" DATETIME NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "whatsappHandoffUrl" TEXT NOT NULL,
    "picNotificationStatus" TEXT NOT NULL DEFAULT 'skipped',
    "picNotificationMessageId" TEXT,
    "picNotificationError" TEXT,
    "accessToken" TEXT NOT NULL,
    "accessExpiresAt" DATETIME NOT NULL,
    "viewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "IntakeLead_dialysisCenterId_fkey" FOREIGN KEY ("dialysisCenterId") REFERENCES "DialysisCenter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "IntakeLead_accessToken_key" ON "IntakeLead"("accessToken");
CREATE INDEX "IntakeLead_dialysisCenterId_idx" ON "IntakeLead"("dialysisCenterId");
CREATE INDEX "IntakeLead_phoneNumber_idx" ON "IntakeLead"("phoneNumber");
CREATE INDEX "IntakeLead_myKadNumber_idx" ON "IntakeLead"("myKadNumber");
CREATE INDEX "IntakeLead_preferredDate_idx" ON "IntakeLead"("preferredDate");
CREATE INDEX "IntakeLead_createdAt_idx" ON "IntakeLead"("createdAt");
