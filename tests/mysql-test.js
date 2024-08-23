/** @module test/mysql */

const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

require("dotenv").config({
    path: ".env.test",
});

/**
 * Gets a root connection to the database
 * 
 * @returns {Promise<mysql.Connection>}
 */
function getRootConnection() {
    return new Promise((res, rej) => {
        mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_ROOT_USERNAME,
            password: process.env.MYSQL_ROOT_PASSWORD,
            port: process.env.MYSQL_PORT || 3306,
        }).then((connection) => {
            res(connection);
        }).catch((error) => {
            rej(error);
        });
    });
}

/**
 * Gets a connection to the database
 * 
 * @returns {Promise<mysql.Connection>}
 */
function getConnection() {
    return new Promise((res, rej) => {
        mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USERNAME,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            port: process.env.MYSQL_PORT || 3306,
        }).then((connection) => {
            res(connection);
        }).catch((error) => {
            rej(error);
        });
    });
}

/**
 * Initializes the test database with the migrations
 * 
 * @returns {Promise<void>}
 */
async function initializeTestDB() {
    const rootConnection = await getRootConnection();

    // Drop if exists and create the database
    await rootConnection.query("DROP DATABASE IF EXISTS " + process.env.MYSQL_DATABASE);
    await rootConnection.query("CREATE DATABASE " + process.env.MYSQL_DATABASE);

    // Create user
    await rootConnection.query("CREATE USER IF NOT EXISTS " + process.env.MYSQL_USERNAME + " IDENTIFIED BY '" + process.env.MYSQL_PASSWORD + "'");
    await rootConnection.query("GRANT ALL PRIVILEGES ON " + process.env.MYSQL_DATABASE + ".* TO " + process.env.MYSQL_USERNAME);

    // Close root connection
    await rootConnection.end();

    // Use the database
    const connection = await getConnection();

    // Create migrations table
    await connection.query("CREATE TABLE IF NOT EXISTS `migrations` (`id` int(11) NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`id`), UNIQUE KEY `name` (`name`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Run migrations
    const migrations = [];
    for (const file of fs.readdirSync(path.join(__dirname, '../migrations'))) {
        if (file.endsWith('.js')) {
            const migration = require(path.join(__dirname, '../migrations', file));
            migrations.push({
                name: file,
                run: migration.run
            });
        }
    }

    // Each file begins with a date and time, so we can sort them: ddmmYYHHMM
    migrations.sort((a, b) => {
        const a_date = new Date();
        a_date.setDate(parseInt(a.name[0] + a.name[1]));
        a_date.setMonth(parseInt(a.name[2] + a.name[3]));
        a_date.setFullYear(parseInt("20" + a.name[4] + a.name[5]));
        a_date.setHours(parseInt(a.name[6] + a.name[7]));
        a_date.setMinutes(parseInt(a.name[8] + a.name[9]));

        const b_date = new Date();
        b_date.setDate(parseInt(b.name[0] + b.name[1]));
        b_date.setMonth(parseInt(b.name[2] + b.name[3]));
        b_date.setFullYear(parseInt("20" + b.name[4] + b.name[5]));
        b_date.setHours(parseInt(b.name[6] + b.name[7]));
        b_date.setMinutes(parseInt(b.name[8] + b.name[9]));

        return a_date - b_date;
    });

    for (const migration of migrations) {
        await migration.run();
        await connection.query(`INSERT INTO migrations (name) VALUES ('${migration.name}')`);
    }

    // Close connection
    await connection.end();

    return;
}

/**
 * Closes the test database
 * 
 * @returns {Promise<void>}
 */
async function closeTestDB() {
    const connection = await getRootConnection();
    await connection.query("DROP DATABASE IF EXISTS " + process.env.MYSQL_DATABASE);
    await connection.query("DROP USER IF EXISTS " + process.env.MYSQL_USERNAME);
    await connection.query("FLUSH PRIVILEGES");
    await connection.end();
    return;
}

module.exports = {
    initializeTestDB,
    closeTestDB,
};