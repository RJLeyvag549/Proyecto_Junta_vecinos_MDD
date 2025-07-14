/*"use strict";
import { Router } from "express";
import { emitirVoto } from "../controllers/voto.controller.js";

import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

router.post("/voto", authenticateJwt, emitirVoto);

export default router;
*/