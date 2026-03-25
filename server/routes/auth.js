import { Router } from "express";
import { register, login, getMe, updateProfile, updatePassword } from "../controllers/authController.js";
import protect from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.patch("/profile", protect, updateProfile);
router.patch("/password", protect, updatePassword);

export default router;