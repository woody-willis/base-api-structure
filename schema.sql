DROP DATABASE IF EXISTS `project_name`;
CREATE DATABASE `project_name`;

-- Create User

DROP USER IF EXISTS 'project_name'@'localhost';

SET @password = SUBSTRING(SHA2(RAND()*1059347, 256) FROM 1 FOR 16);
SET @userCreation = CONCAT('CREATE USER "project_name"@"localhost" IDENTIFIED BY "', @password,'";');
PREPARE stmt FROM @userCreation;
EXECUTE stmt;

GRANT ALL PRIVILEGES ON project_name.* TO 'project_name'@'localhost';
GRANT BINLOG_ADMIN ON *.* TO 'project_name'@'localhost';

USE `project_name`;

-- Migrations Table

CREATE TABLE IF NOT EXISTS `migrations` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

FLUSH PRIVILEGES;

SELECT "Please now run 'npm run migrate' to complete the database. | " AS "Message | ", @password AS "Password for MySQL User";

-- Clean up
SET @project_name_password = NULL;