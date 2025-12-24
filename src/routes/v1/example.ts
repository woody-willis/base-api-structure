/**
 * @module routes/v1/example
 * Router for example endpoints in version 1 of the API
 */

import { Router } from "express";

import { getExample } from "../../controllers/example";

const router = Router();

router.use("/example", getExample);

export default router;
