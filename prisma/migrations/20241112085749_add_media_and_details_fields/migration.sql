-- Check if columns don't exist before adding them
SELECT CASE 
    WHEN COUNT(*) = 0 THEN 'ALTER TABLE "DialysisCenter" ADD COLUMN "description" TEXT;'
    ELSE 'SELECT 1;'
END AS sql_statement
FROM pragma_table_info('DialysisCenter')
WHERE name = 'description';

SELECT CASE 
    WHEN COUNT(*) = 0 THEN 'ALTER TABLE "DialysisCenter" ADD COLUMN "benefits" TEXT;'
    ELSE 'SELECT 1;'
END AS sql_statement
FROM pragma_table_info('DialysisCenter')
WHERE name = 'benefits';

SELECT CASE 
    WHEN COUNT(*) = 0 THEN 'ALTER TABLE "DialysisCenter" ADD COLUMN "photos" TEXT;'
    ELSE 'SELECT 1;'
END AS sql_statement
FROM pragma_table_info('DialysisCenter')
WHERE name = 'photos';

SELECT CASE 
    WHEN COUNT(*) = 0 THEN 'ALTER TABLE "DialysisCenter" ADD COLUMN "videos" TEXT;'
    ELSE 'SELECT 1;'
END AS sql_statement
FROM pragma_table_info('DialysisCenter')
WHERE name = 'videos';

-- Update existing records to have a unique slug (if needed)
UPDATE "DialysisCenter"
SET "slug" = lower(replace(replace("dialysisCenterName", ' ', '-'), ',', '')) || '-' || id
WHERE "slug" = '';

-- Add indexes if they don't exist
CREATE INDEX IF NOT EXISTS "DialysisCenter_slug_idx" ON "DialysisCenter"("slug");
