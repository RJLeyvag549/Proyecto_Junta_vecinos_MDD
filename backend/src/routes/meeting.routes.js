"use strict";
import { Router } from "express";
import { getMeetings, createMeeting, getMeetingById, getMeeting, updateMeetingById, deleteMeetingById } from "../controllers/meeting.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);
// Rutas públicas
router.get("/calendar", getMeeting);
router.use(isAdmin);

// Rutas para obtener usuarios
router.post("/", createMeeting);
router.get("/", getMeetings);
router.get("/:id", getMeetingById);
router.put("/:id", updateMeetingById);
router.delete("/:id", deleteMeetingById);

export default router;