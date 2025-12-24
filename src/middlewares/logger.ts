/**
 * @file Request logging middleware.
 *
 * This middleware logs all incoming HTTP requests for debugging and monitoring purposes.
 *
 * @module middlewares/logger
 */

import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

/**
 * Express middleware that logs all incoming HTTP requests.
 *
 * Logs the HTTP method, path, and client IP address for each request.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function.
 * @returns {void}
 */
export const requestLogger = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.info({ ip: req.ip }, `${req.method} ${req.path}`);
    next();
};
