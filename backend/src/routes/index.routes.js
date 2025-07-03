"use strict";
import { Router } from "express";
import authRoutes from "./auth.routes.js"
import userRoutes from "./user.routes.js";
import meetingRoutes from "./meeting.routes.js"
import attendanceRoutes from "./attendance.routes.js"
import ActRoutes from "./meeting_act.routes.js"

const router = new Router();  

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/meetings", meetingRoutes);
router.use("/meetings", attendanceRoutes);
router.use("/meetings", ActRoutes);

export default router;