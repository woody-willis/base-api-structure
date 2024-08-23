/** @module controllers */

const BaseDatabaseController = require("./BaseDatabaseController");

/** Class representing a migration controller. */
class MigrationController extends BaseDatabaseController {
    /** Create a migration controller. */
    constructor() {
        super();
    }

    /**
     * Get a migration by name.
     * 
     * @param {string} name
     * @returns {Promise<object>}
     */
    async byName(name) {
        const response = await this._query('SELECT * FROM migrations WHERE name = ?', name);
        if (response.length !== 1) {
            return null;
        }

        return response[0];
    }

    /**
     * Get a migration by id.
     * 
     * @param {number} id
     * @returns {Promise<object>}
    */
    async byId(id) {
        const response = await this._query('SELECT * FROM migrations WHERE id = ?', id);
        if (response.length !== 1) {
            return null;
        }

        return response[0];
    }


    /**
     * Insert a migration.
     * 
     * @param {string} name
     * @returns {Promise<void>}
     */
    async insert(name) {
        await this._query('INSERT INTO migrations (name) VALUES (?)', name);
    }
}

module.exports = MigrationController;