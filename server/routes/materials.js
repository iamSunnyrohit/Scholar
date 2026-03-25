import { Router } from "express";
import multer from "multer";
// FIX: `protect` is a default export from auth middleware, not a named export
import protect from "../middleware/auth.js";
import { generateFromText, generateFromPDF, getMaterials, getMaterial, deleteMaterial } from "../controllers/materialController.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const router = Router();
router.use(protect);

router.get("/", getMaterials);
router.get("/:id", getMaterial);
router.post("/generate", generateFromText);
router.post("/upload-pdf", upload.single("pdf"), generateFromPDF);
router.delete("/:id", deleteMaterial);

export default router;