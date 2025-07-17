import { Router } from "express";
import { addFamilyMember } from "../controllers/familyGroup.controller.js";

const router = Router();

router.post("/add", addFamilyMember);

export default router;