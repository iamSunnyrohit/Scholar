import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "Name, email, and password are required." });

    // FIX: Normalize email to lowercase before checking existence,
    // matching the `lowercase: true` on the User schema
    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(409).json({ error: "Email already registered." });

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, subscriptionTier: user.subscriptionTier },
    });
  } catch (err) { next(err); }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required." });

    // FIX: Normalize email to lowercase before querying — the schema stores
    // emails in lowercase via `lowercase: true`, so a query with mixed-case
    // email will find no user and incorrectly return 401
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: "Invalid email or password." });

    const token = signToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, subscriptionTier: user.subscriptionTier },
    });
  } catch (err) { next(err); }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  const { _id: id, name, email, subscriptionTier, aiGenerationsUsed, createdAt } = req.user;
  res.json({ id, name, email, subscriptionTier, aiGenerationsUsed, createdAt });
};

// PUT /api/auth/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    if (!name || !email)
      return res.status(400).json({ error: "Name and email are required." });

    const normalized = email.toLowerCase().trim();
    const conflict = await User.findOne({ email: normalized, _id: { $ne: req.user._id } });
    if (conflict) return res.status(409).json({ error: "Email already in use by another account." });

    req.user.name  = name.trim();
    req.user.email = normalized;
    await req.user.save();

    const { _id: id, subscriptionTier, aiGenerationsUsed, createdAt } = req.user;
    res.json({ id, name: req.user.name, email: req.user.email, subscriptionTier, aiGenerationsUsed, createdAt });
  } catch (err) { next(err); }
};

// PUT /api/auth/password
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ error: "Current password and new password are required." });
    if (newPassword.length < 6)
      return res.status(400).json({ error: "New password must be at least 6 characters." });

    const user = await User.findById(req.user._id);
    const match = await user.comparePassword(currentPassword);
    if (!match) return res.status(401).json({ error: "Current password is incorrect." });

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password updated successfully." });
  } catch (err) { next(err); }
};