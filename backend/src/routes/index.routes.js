"use strict";
import { Router } from "express";
import authRoutes from "./auth.routes.js"
import userRoutes from "./user.routes.js";
import TransactionRoutes from "./transaction.routes.js";
import InventoryRoutes from "./inventory.routes.js";

const router = new Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/transaction", TransactionRoutes);
router.use("/inventory", InventoryRoutes);

export default router;