// FIX: Replaced `require()` with `import`, and `exports.` with `export const`
import QuizResult from "../models/QuizResult.js";
import Material from "../models/Material.js";

// POST /api/quiz/:materialId/submit
export const submitQuiz = async (req, res, next) => {
  try {
    const { answers, questions, timeTakenSeconds } = req.body;
    if (!answers || !questions)
      return res.status(400).json({ error: "answers and questions are required." });

    const material = await Material.findOne({ _id: req.params.materialId, user: req.user._id });
    if (!material) return res.status(404).json({ error: "Material not found." });

    const evaluated = questions.map((q, i) => ({
      ...q,
      selected: answers[i],
      isCorrect: answers[i] === q.correct,
    }));

    const score = evaluated.filter((q) => q.isCorrect).length;
    const percentage = Math.round((score / questions.length) * 100);

    const result = await QuizResult.create({
      material: material._id,
      user: req.user._id,
      questions: evaluated,
      score,
      total: questions.length,
      percentage,
      timeTakenSeconds,
    });

    res.status(201).json({ result });
  } catch (err) { next(err); }
};

// GET /api/quiz/:materialId/history
export const getQuizHistory = async (req, res, next) => {
  try {
    const results = await QuizResult.find({ material: req.params.materialId, user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ results });
  } catch (err) { next(err); }
};