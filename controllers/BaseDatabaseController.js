/** @module controllers */

require("dotenv").config({
    path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const mysql = require("mysql2/promise");

/** Class representing a base database controller. */
class BaseDatabaseController {
    static pool = mysql.createPool({
        host: process.env.MYSQL_HOST,
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        port: process.env.MYSQL_PORT || 3306,
        connectionLimit: 50
    });

    constructor() {
        /** @type {mysql.PoolConnection} */
        this.connection = null;
    }

    /**
     * Get a connection from the pool.
     * 
     * @returns {Promise<mysql.PoolConnection>}
     */
    #getConnection() {
        return BaseDatabaseController.pool.getConnection();
    }

    /** 
     * Send a query to the database. THIS METHOD SHOULD ONLY BE USED BY CHILDREN OF THIS CLASS OR MIGRATIONS.
     * 
     * @param {string} query
     * @param {any} ...preparedStatementValues
     * @returns {Promise<any[]>}
    */
    _query(query, ...preparedStatementValues) {
        return new Promise(async (res, rej) => {
            if (!this.connection) this.connection = await this.#getConnection();

            try {
                const [response] = await this.connection.query(query, preparedStatementValues);
                res(response);
            } finally {
                this.connection.release();
                this.connection = null;
            }
        });
    }

    /**
     * Start a transaction.
     * 
     * @returns {Promise<void>}
     */
    _startTransaction() {
        return new Promise(async (res, rej) => {
            if (!this.connection) this.connection = await this.#getConnection();

            try {
                await this.connection.beginTransaction();
            } catch (err) {
                rej(err);
            }

            res();
        });
    }

    /**
     * Send a query to the database within a transaction.
     * 
     * @param {string} query
     * @param {any} ...preparedStatementValues
     * @returns {Promise<any[]>}
     */
    _queryTransaction(query, ...preparedStatementValues) {
        return new Promise(async (res, rej) => {
            try {
                const [response] = await this.connection.query(query, preparedStatementValues);
                res(response);
            } catch (err) {
                rej(err);
            }
        });
    }

    /**
     * End a transaction.
     * 
     * @returns {Promise<void>}
     */
    _endTransaction() {
        return new Promise(async (res, rej) => {
            if (!this.connection) this.connection = await this.#getConnection();

            try {
                await this.connection.commit();
            } finally {
                this.connection.release();
                this.connection = null;
            }

            res();
        });
    }
}

module.exports = BaseDatabaseController;