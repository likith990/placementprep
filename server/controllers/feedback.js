import Feedback from "../models/Feedback.js";
import {
  getPendingFeedback,
  getFeedbackSummary,
} from "../utils/feedbackHelpers.js";

export async function getMyPendingFeedback(req, res) {
  try {
    const pending = await getPendingFeedback(req.currentUser._id);
    res.status(200).json(pending);
  } catch (err) {
    req.log.error(err);
    res
      .status(500)
      .json({
        message: "Failed to fetch pending feedback",
        error: err.message,
      });
  }
}

export async function submitFeedback(req, res) {
  try {
    const { slotId, toUserId, noShow, ratings, comment } = req.body;
    const fromUser = req.currentUser._id;

    if (!slotId || !toUserId) {
      return res
        .status(400)
        .json({ message: "slotId and toUserId are required" });
    }

    if (toUserId === fromUser.toString()) {
      return res
        .status(400)
        .json({ message: "You can't submit feedback for yourself" });
    }

    if (!noShow) {
      const { communication, technical, problemSolving } = ratings || {};
      if (!communication || !technical || !problemSolving) {
        return res
          .status(400)
          .json({
            message:
              "All three ratings are required unless reporting a no-show",
          });
      }
    }

    const feedback = await Feedback.create({
      slot: slotId,
      fromUser,
      toUser: toUserId,
      noShow: !!noShow,
      ratings: noShow ? undefined : ratings,
      comment,
    });

    res.status(201).json(feedback);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({
          message: "You've already submitted feedback for this session",
        });
    }
    req.log.error(err);
    res
      .status(500)
      .json({ message: "Failed to submit feedback", error: err.message });
  }
}

export async function getUserFeedback(req, res) {
  try {
    const { userId } = req.params;
    const summary = await getFeedbackSummary(userId);
    res.status(200).json(summary);
  } catch (err) {
    req.log.error(err);
    res
      .status(500)
      .json({ message: "Failed to fetch user feedback", error: err.message });
  }
}
