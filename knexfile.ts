import "dotenv/config";
import knex from "knex";

const config: knex.Knex.Config = {
    client: "mysql2",
    connection: {
        host: process.env.MYSQL_HOST,
        port: Number(process.env.MYSQL_PORT),
        user: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    },

    migrations: { directory: "./db/migrations" },
    seeds: { directory: "./db/seeds" },
};

export default config;
