import { Router } from "express";
// FIX: `protect` is a default export from auth middleware, not a named export
import protect from "../middleware/auth.js";
import { submitQuiz, getQuizHistory } from "../controllers/quizController.js";

const router = Router();

router.use(protect);

router.post("/:materialId/submit", submitQuiz);
router.get("/:materialId/history", getQuizHistory);

export default router;