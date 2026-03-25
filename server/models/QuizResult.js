import mongoose from "mongoose"; 

const quizResultSchema = new mongoose.Schema(
  {
    material: { type: mongoose.Schema.Types.ObjectId, ref: "Material", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    questions: [
      {
        question: String,
        options: [String],
        correct: Number,
        selected: Number,
        explanation: String,
        isCorrect: Boolean,
      },
    ],
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    percentage: { type: Number, required: true },
    timeTakenSeconds: { type: Number },
  },
  { timestamps: true }
);

const QuizResult = mongoose.model("QuizResult", quizResultSchema);
export default QuizResult; 