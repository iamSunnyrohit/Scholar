import { Router } from "express";
// FIX: `protect` is a default export from auth middleware, not a named export
import protect from "../middleware/auth.js";
import { getFlashcards, getDueCards, reviewCard } from "../controllers/flashcardController.js";

const router = Router();

router.use(protect);

router.get("/due", getDueCards);
router.get("/:materialId", getFlashcards);
router.patch("/:id/review", reviewCard);

export default router;