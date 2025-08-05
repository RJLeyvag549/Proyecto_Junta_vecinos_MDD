"use strict";

import { Router } from "express";
import { getUsers, getUserById, updateUserById, deleteUserById, updateRequestStatus, getPendingUsers } from "../controllers/user.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);
router.use(isAdmin);

router.get('/pending', getPendingUsers);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUserById);
router.delete("/:id", deleteUserById);
router.patch("/:id/status", updateRequestStatus);


export default router;