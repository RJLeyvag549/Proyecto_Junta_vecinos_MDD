import { Router } from "express"
import { register, login, getCurrentUser } from "../controllers/auth.controller.js"
import { uploadDocuments, handleFileSizeLimit } from "../middleware/uploadArchive.middleware.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";

const router = Router();

router.post("/register", uploadDocuments, handleFileSizeLimit, register);
router.post("/login", login);
router.get("/profile", authenticateJwt, getCurrentUser);

export default router;