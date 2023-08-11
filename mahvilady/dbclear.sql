SET FOREIGN_KEY_CHECKS = 0;
SELECT CONCAT('DROP TABLE IF EXISTS `', table_name, '`;') AS stmt
FROM information_schema.tables
WHERE table_schema = 'mehvi_lady';
SET FOREIGN_KEY_CHECKS = 1;



