import pdfParse from "pdf-parse";
import Material from "../models/Material.js"; 
import Flashcard from "../models/Flashcard.js";

let anthropic;
async function getAnthropicClient() {
  if (!anthropic) {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return anthropic;
}

const CHUNK_SIZE = 8000;
function chunkText(text) {
  if (text.length <= CHUNK_SIZE) return [text];
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    let end = i + CHUNK_SIZE;
    if (end < text.length) {
      const boundary = text.lastIndexOf(". ", end);
      if (boundary > i + CHUNK_SIZE * 0.6) end = boundary + 2;
    }
    chunks.push(text.slice(i, end));
    i = end;
  }
  return chunks;
}

async function generateWithClaude(text) {
  const client = await getAnthropicClient();
  const chunks = chunkText(text);
  let processedText = text;
  if (chunks.length > 1) {
    const summaries = await Promise.all(
      chunks.map((chunk) =>
        client.messages.create({
          model: "claude-3-5-haiku-20241022",
          max_tokens: 400,
          messages: [{ role: "user", content: `Summarize the key points of this text in 3-4 sentences:\n\n${chunk}` }],
        }).then((r) => r.content[0].text)
      )
    );
    processedText = summaries.join("\n\n");
  }

  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1500,
    system: `You are an expert educator and instructional designer. Analyze study material and return ONLY valid JSON. No preamble, no markdown fencing.`,
    messages: [
      {
        role: "user",
        content: `Analyze this text and return JSON matching this exact schema:
{
  "title": "short descriptive course title (max 6 words)",
  "emoji": "one relevant emoji",
  "summary": "2-3 sentence overview",
  "bulletPoints": ["key concept 1", "key concept 2", "key concept 3", "key concept 4", "key concept 5"],
  "flashcards": [
    { "question": "...", "answer": "...", "difficulty": "easy|medium|hard" },
    { "question": "...", "answer": "...", "difficulty": "easy|medium|hard" },
    { "question": "...", "answer": "...", "difficulty": "easy|medium|hard" },
    { "question": "...", "answer": "...", "difficulty": "easy|medium|hard" },
    { "question": "...", "answer": "...", "difficulty": "easy|medium|hard" }
  ],
  "quiz": [
    { "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": 0, "explanation": "..." },
    { "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": 2, "explanation": "..." },
    { "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": 1, "explanation": "..." },
    { "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": 3, "explanation": "..." }
  ]
}

Text:
${processedText}`,
      },
    ],
  });

  const raw = response.content[0].text.replace(/```json|```/g, "").trim();
  return JSON.parse(raw);
}

// POST /api/materials/generate  (text upload)
// FIX: Changed `exports.generateFromText` to `export const generateFromText`
export const generateFromText = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length < 100)
      return res.status(400).json({ error: "Please provide at least 100 characters of study material." });

    if (!req.user.canGenerate())
      return res.status(403).json({ error: "Monthly AI generation limit reached. Upgrade your plan." });

    const material = await Material.create({ user: req.user._id, title: "Processing…", rawText: text, status: "processing" });

    const aiData = await generateWithClaude(text);

    material.title = aiData.title;
    material.emoji = aiData.emoji;
    material.summary = aiData.summary;
    material.bulletPoints = aiData.bulletPoints;
    material.status = "ready";
    await material.save();

    const flashcards = await Flashcard.insertMany(
      aiData.flashcards.map((fc) => ({
        material: material._id,
        user: req.user._id,
        question: fc.question,
        answer: fc.answer,
        difficulty: fc.difficulty,
      }))
    );

    req.user.aiGenerationsUsed += 1;
    await req.user.save();

    res.status(201).json({
      material: { ...material.toJSON(), flashcards, quiz: aiData.quiz },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/materials/upload-pdf  (PDF upload)
// FIX: Changed `exports.generateFromPDF` to `export const generateFromPDF`
export const generateFromPDF = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF file uploaded." });
    if (!req.user.canGenerate())
      return res.status(403).json({ error: "Monthly AI generation limit reached." });

    const parsed = await pdfParse(req.file.buffer);
    const text = parsed.text?.trim();
    if (!text || text.length < 100)
      return res.status(422).json({ error: "Could not extract readable text from this PDF." });

    req.body.text = text;
    return generateFromText(req, res, next); // FIX: was `exports.generateFromText`
  } catch (err) {
    next(err);
  }
};

// GET /api/materials
// FIX: Changed `exports.getMaterials` to `export const getMaterials`
export const getMaterials = async (req, res, next) => {
  try {
    const materials = await Material.find({ user: req.user._id, isArchived: false })
      .sort({ createdAt: -1 })
      .populate("flashcardCount");
    res.json({ materials });
  } catch (err) { next(err); }
};

// GET /api/materials/:id
// FIX: Changed `exports.getMaterial` to `export const getMaterial`
export const getMaterial = async (req, res, next) => {
  try {
    const material = await Material.findOne({ _id: req.params.id, user: req.user._id });
    if (!material) return res.status(404).json({ error: "Material not found." });
    const flashcards = await Flashcard.find({ material: material._id });
    res.json({ material: material.toJSON(), flashcards });
  } catch (err) { next(err); }
};

// DELETE /api/materials/:id
// FIX: Changed `exports.deleteMaterial` to `export const deleteMaterial`
export const deleteMaterial = async (req, res, next) => {
  try {
    const material = await Material.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isArchived: true },
      { new: true }
    );
    if (!material) return res.status(404).json({ error: "Material not found." });
    res.json({ message: "Material archived." });
  } catch (err) { next(err); }
};