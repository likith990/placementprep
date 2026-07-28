
import { getPendingFeedback } from "../utils/feedbackHelpers.js";

export default async function blockIfPendingFeedback(req, res, next) {
  try {
    const pending = await getPendingFeedback(req.currentUser._id);

    if (pending.length > 0) {
      return res.status(403).json({
        message: "You have pending feedback to submit before you can do this.",
        pendingFeedback: pending,
      });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to check pending feedback", error: err.message });
  }
}