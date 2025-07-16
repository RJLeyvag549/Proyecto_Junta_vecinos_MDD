"use strict";

import { Router } from "express";
import { getResidenceCertificate } from "../controllers/pdf.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";

const router = Router();

// GET para solicitar el certificado de residencia
router.get("/residence", authenticateJwt, getResidenceCertificate);

export default router;
