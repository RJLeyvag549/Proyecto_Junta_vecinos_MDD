"use strict";
import { Router } from "express";
import authRoutes from "./auth.routes.js"
import userRoutes from "./user.routes.js";
import votacionRoutes from "./votacion.routes.js";
// import votoRoutes from "./voto.routes.js";

const router = new Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/votacion", votacionRoutes);
// router.use("/voto", votoRoutes);
    
export default router;