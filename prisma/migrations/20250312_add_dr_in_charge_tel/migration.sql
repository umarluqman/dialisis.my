-- Check if column doesn't exist before adding it
SELECT CASE 
    WHEN COUNT(*) = 0 THEN 'ALTER TABLE "DialysisCenter" ADD COLUMN "drInChargeTel" TEXT NOT NULL DEFAULT "";'
    ELSE 'SELECT 1;'
END AS sql_statement
FROM pragma_table_info('DialysisCenter')
WHERE name = 'drInChargeTel'; 