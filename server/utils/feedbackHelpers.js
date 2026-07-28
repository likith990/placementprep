

import Slot from "../models/Slot.js";
import Feedback from "../models/Feedback.js";
import { isSlotPast } from "./SlotTime.js";

export async function getPendingFeedback(userId) {
  const slots = await Slot.find({
    $or: [
      { interviewer: userId },
      { requests: { $elemMatch: { user: userId, status: "booked" } } },
    ],
  })
    .populate("interviewer", "username")
    .populate("requests.user", "username")
    .lean();

  const pastSlots = slots.filter((slot) => isSlotPast(slot));
  if (pastSlots.length === 0) return [];

  const slotIds = pastSlots.map((s) => s._id);
  const existingFeedback = await Feedback.find({
    slot: { $in: slotIds },
    fromUser: userId,
  }).lean();

  const submittedSet = new Set(
    existingFeedback.map((f) => `${f.slot.toString()}_${f.toUser.toString()}`)
  );

  const pending = [];

  for (const slot of pastSlots) {
    const bookedUsers = (slot.requests || [])
      .filter((r) => r.status === "booked")
      .map((r) => r.user)
      .filter(Boolean);

    const participants = [slot.interviewer, ...bookedUsers].filter(Boolean);
    if (participants.length < 2) continue;

    const isParticipant = participants.some(
      (p) => p._id.toString() === userId.toString()
    );
    if (!isParticipant) continue;

    for (const other of participants) {
      if (other._id.toString() === userId.toString()) continue;

      const key = `${slot._id.toString()}_${other._id.toString()}`;
      if (!submittedSet.has(key)) {
        pending.push({
          slotId: slot._id,
          slotTitle: slot.title,
          toUser: { _id: other._id, username: other.username },
        });
      }
    }
  }

  return pending;
}

export async function getFeedbackSummary(userId) {
  const feedback = await Feedback.find({ toUser: userId, noShow: false })
    .select("ratings comment createdAt fromUser")
    .populate("fromUser", "username")
    .sort({ createdAt: -1 })
    .lean();

  const count = feedback.length;
  const avg = (key) =>
    count === 0 ? null : feedback.reduce((sum, f) => sum + f.ratings[key], 0) / count;

  return {
    count,
    averages: {
      communication: avg("communication"),
      technical: avg("technical"),
      problemSolving: avg("problemSolving"),
    },
    feedback,
  };
}