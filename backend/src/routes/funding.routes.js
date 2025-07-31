import { Router } from "express";
import { createFunding, getFunding, updateFunding, deleteFunding } from "../controllers/funding.controller.js";
import { exportFundingSheet } from "../controllers/fundingSheet.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);
router.use(isAdmin);

router.post("/create", createFunding);
router.get("/", getFunding);
router.put("/:id", updateFunding);
router.delete("/:id", deleteFunding);
router.get("/planilla", exportFundingSheet);


export default router;