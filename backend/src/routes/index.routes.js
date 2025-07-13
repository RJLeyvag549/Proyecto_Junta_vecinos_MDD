"use strict";
import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import publicacionesRoutes from "./publicaciones.routes.js"
import comentariosRoutes from "./comentarios.routes.js";
import fundingRoutes from "./funding.routes.js";


const router = new Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/publicaciones", publicacionesRoutes);
router.use("/comentarios", comentariosRoutes);
router.use("/funding", fundingRoutes);

export default router;