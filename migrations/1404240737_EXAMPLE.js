const BaseDatabaseController = require("../controllers/BaseDatabaseController");

const sql = [
    `SELECT 'This is an example migration file!' AS message;`,
];

module.exports.run = () => {
    return new Promise(async (res, rej) => {
        const controller = new BaseDatabaseController();
        for (const sql_query of sql) {
            try {
                await controller._query(sql_query);
            } catch (error) {
                rej(error);
            }
        }
        res();
    });
}