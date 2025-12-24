/**
 * @file # Logging utility using Pino.
 *
 * This module configures and exports a Pino logger instance with pretty printing
 * for development. Used throughout the application for structured logging.
 *
 * @module utils/logger
 */

import pino from "pino";

/**
 * Configures and exports a Pino logger instance.
 */
const logger = pino({ level: "info", transport: { target: "pino-pretty" } });

export default logger;
