

import User from "../models/User.js";
import Slot from "../models/Slot.js";
import { getFeedbackSummary } from "../utils/feedbackHelpers.js";
import { isSlotPast } from "../utils/SlotTime.js";

const ALLOWED_LEVELS = ["student", "junior", "mid", "senior"];

export async function getUserProfile(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select(
      "username email bio skills experienceLevel targetRole links"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { count, averages, feedback } = await getFeedbackSummary(id);

    const slots = await Slot.find({
      $or: [
        { interviewer: id },
        { requests: { $elemMatch: { user: id, status: "booked" } } },
      ],
    }).lean();

    const sessionCount = slots.filter((slot) => isSlotPast(slot)).length;

    res.status(200).json({
      user,
      feedback: { count, averages, feedback },
      sessionCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch profile", error: err.message });
  }
}

export async function updateMyProfile(req, res) {
  try {
    const { bio, skills, experienceLevel, targetRole, links } = req.body;

    if (experienceLevel && !ALLOWED_LEVELS.includes(experienceLevel)) {
      return res.status(400).json({ message: "Invalid experience level" });
    }

    const update = {};
    if (bio !== undefined) update.bio = bio;
    if (skills !== undefined) update.skills = skills;
    if (experienceLevel !== undefined) update.experienceLevel = experienceLevel;
    if (targetRole !== undefined) update.targetRole = targetRole;
    if (links !== undefined) {
      update.links = {
        linkedin: links.linkedin || "",
        github: links.github || "",
        portfolio: links.portfolio || "",
      };
    }

    const updated = await User.findByIdAndUpdate(req.currentUser._id, update, {
      new: true,
      runValidators: true,
    }).select("username email bio skills experienceLevel targetRole links");

    res.status(200).json({ user: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
}