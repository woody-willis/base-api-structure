/**
 * @file Main entry point for the M3U streaming server.
 *
 * This file initializes and configures the Express application with middleware,
 * routes, security features and monitoring.
 */

import "dotenv/config";

import io from "@pm2/io";
import logger from "./utils/logger";
import app from "./app";
// import cron from "node-cron";

io.init({
    metrics: {
        v8: true,
        network: false,
        http: true,
        eventLoop: true,
        runtime: true,
    },
});

/**
 * Main application initialization function.
 *
 * Configures and starts the Express server with all necessary middleware,
 * routes, and settings. Establishes Redis connection and initializes
 * scheduled jobs.
 *
 * @async
 * @returns {Promise<void>}
 */
async function main() {
    startCrons();

    const PORT = process.env.PORT || 3000;

    // Initialize Database
    // await initializeDatabase();

    // Start API
    app.listen(PORT, () => {
        logger.info(`API is listening on port ${PORT}`);
    });
}

function startCrons() {
    // Schedule the task to run every 20 minutes
    // cron.schedule('*/20 * * * *', exampleCron);
    // exampleCron();

    logger.info("Cron jobs started.");
}

main().catch((error) => {
    logger.error(error, `Uncaught exception`);
});
