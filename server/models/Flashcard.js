import mongoose from "mongoose";
const { Schema } = mongoose ;

const flashcardSchema = new mongoose.Schema(
  {
    material: { type: mongoose.Schema.Types.ObjectId, ref: "Material", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    // Spaced repetition: 0=new, 1=learning, 2=familiar, 3=mastered
    masteryLevel: { type: Number, default: 0, min: 0, max: 3 },
    // Spaced repetition scheduling
    nextReviewAt: { type: Date, default: () => new Date() },
    reviewCount: { type: Number, default: 0 },
    lastReviewedAt: { type: Date },
  },
  { timestamps: true }
);

// Index for efficient "due cards" queries
flashcardSchema.index({ user: 1, nextReviewAt: 1 });
flashcardSchema.index({ material: 1 });

// Spaced repetition interval (days) by mastery level
const INTERVALS = { 0: 0, 1: 1, 2: 3, 3: 7 };

flashcardSchema.methods.updateMastery = function (correct) {
  if (correct) {
    this.masteryLevel = Math.min(3, this.masteryLevel + 1);
  } else {
    this.masteryLevel = Math.max(0, this.masteryLevel - 1);
  }
  const days = INTERVALS[this.masteryLevel];
  this.nextReviewAt = new Date(Date.now() + days * 86400000);
  this.reviewCount += 1;
  this.lastReviewedAt = new Date();
};

const Flashcard = mongoose.model("FlashCard", flashcardSchema);
export default Flashcard;