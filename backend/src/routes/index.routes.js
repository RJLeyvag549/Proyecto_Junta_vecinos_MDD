"use strict";

import { Router } from "express";
import authRoutes from "./auth.routes.js"
import userRoutes from "./user.routes.js";
import familyGroupRoutes from "./familyGroup.routes.js";
import pdfRoutes from "./pdf.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/family", familyGroupRoutes);
router.use("/certificate", pdfRoutes);

export default router;