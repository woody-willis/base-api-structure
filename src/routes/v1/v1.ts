/**
 * @module routes/v1/v1
 * Main router for version 1 of the API
 */

import { Router } from "express";

import exampleRouter from "./example";

const router = Router();

router.use("/", exampleRouter);

export default router;
