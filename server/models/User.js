import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    subscriptionTier: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free",
    },  
    // AI usage tracking (enforced per tier)
    aiGenerationsUsed: { type: Number, default: 0 },
    aiGenerationsResetAt: { type: Date, default: () => new Date() },
    savedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Material" }],
  },
  { timestamps: true }
);

// Limits per tier (generations per month)
userSchema.statics.TIER_LIMITS = { free: 5, pro: 50, enterprise: Infinity };

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.canGenerate = function () {
  const limit = this.constructor.TIER_LIMITS[this.subscriptionTier];
  // Reset counter monthly
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  if (this.aiGenerationsResetAt < monthAgo) {
    this.aiGenerationsUsed = 0;
    this.aiGenerationsResetAt = new Date();
  }
  return this.aiGenerationsUsed < limit;
};

const User = mongoose.model("User",userSchema);
export default User;
