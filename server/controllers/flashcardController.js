import Flashcard from "../models/Flashcard.js"; // Added .js and changed to import

export const getFlashcards = async (req, res, next) => {
  try {
    const cards = await Flashcard.find({ material: req.params.materialId, user: req.user._id });
    res.json({ flashcards: cards });
  } catch (err) { next(err); }
};

export const getDueCards = async (req, res, next) => {
  try {
    const cards = await Flashcard.find({
      user: req.user._id,
      nextReviewAt: { $lte: new Date() },
    }).populate("material", "title emoji").limit(20);
    res.json({ flashcards: cards });
  } catch (err) { next(err); }
};

export const reviewCard = async (req, res, next) => {
  try {
    const { correct } = req.body;
    const card = await Flashcard.findOne({ _id: req.params.id, user: req.user._id });
    if (!card) return res.status(404).json({ error: "Flashcard not found." });

    card.updateMastery(correct);
    await card.save();
    res.json({ flashcard: card });
  } catch (err) { next(err); }
};