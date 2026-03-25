import mongoose from "mongoose";
const { Schema } = mongoose;

const materialSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    emoji: { type: String, default: "📚" },
    rawText: { type: String, required: true },
    // AI-generated fields
    summary: { type: String, default: "" },
    bulletPoints: [{ type: String }],
    // Status of AI processing
    status: {
      type: String,
      enum: ["pending", "processing", "ready", "error"],
      default: "pending",
    },
    errorMessage: { type: String },
    // Soft delete
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

// Virtual: flashcard count
materialSchema.virtual("flashcardCount", {
  ref: "Flashcard",
  localField: "_id",
  foreignField: "material",
  count: true,
});

const Material = mongoose.model("Material", materialSchema);
export default Material;
