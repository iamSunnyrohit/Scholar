import express, { json, urlencoded, static as expressStatic } from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import materialRoutes from "./routes/materials.js";
import flashcardRoutes from "./routes/flashcards.js";
import quizRoutes from "./routes/quiz.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ── Middleware ──────────────────────────────────────────────────────────────
// FIX: Allow multiple origins so both CRA (:3000) and Vite (:5173) work.
// The allowed origin is driven by CLIENT_URL in your .env file.
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

app.use(json({ limit: "10mb" }));
app.use(urlencoded({ extended: true, limit: "10mb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests. Please try again later." },
});
app.use("/api", limiter);

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: "AI generation limit reached. Please wait before generating more content." },
});
app.use("/api/materials/generate", aiLimiter);

// ── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/flashcards", flashcardRoutes);
app.use("/api/quiz", quizRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Serve client in production ───────────────────────────────────────────────
if (process.env.NODE_ENV === "production") {
  app.use(expressStatic(join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(join(__dirname, "../client/dist/index.html"));
  });
}

// ── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ── Connect to MongoDB and start server ──────────────────────────────────────
const PORT = process.env.PORT || 5003;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});