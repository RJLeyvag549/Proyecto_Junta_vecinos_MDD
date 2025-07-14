import { Router } from "express";
import { createFunding, getFunding, updateFunding, deleteFunding } from "../controllers/funding.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);
router.use(isAdmin);
// Rutas CRUD de fondos públicos
router.post("/create", createFunding);
router.get("/", getFunding);
router.put("/:id", updateFunding);
router.delete("/:id", deleteFunding);


export default router;