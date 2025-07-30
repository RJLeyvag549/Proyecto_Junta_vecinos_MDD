"use strict";
import { Router } from "express";
import { getUsers, getUserById, getUsersByFilters, updateUserById, deleteUserById } from "../controllers/user.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";
import { getProfile } from "../controllers/auth.controller.js"

const router = Router();

    router.use(authenticateJwt);

    router.get("/profile", getProfile);

    router.use(isAdmin);

    router.get("/filtered", getUsersByFilters);
    router.get("/", getUsers);
    router.get("/:id", getUserById);
    router.put("/:id", updateUserById);
    router.delete("/:id", deleteUserById);

export default router;