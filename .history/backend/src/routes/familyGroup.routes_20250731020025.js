import { Router } from "express";
import { addFamilyMember, deleteFamilyMemberById } from "../controllers/familyGroup.controller.js";

const router = Router();

router.post("/add/:userId", addFamilyMember);
router.delete("/:id,", deleteFamilyMemberById  )

export default router;
