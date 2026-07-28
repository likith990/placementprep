

import Slot from "../models/Slot.js";
import notify from "../utils/notify.js";

export async function rescheduleSlot(req, res) {
  try {
    const { id } = req.params;
    const currentUser = req.currentUser;
    const { title, description, topic, capacity, starttime, duration, meetinglink } = req.body;

    const slot = await Slot.findById(id);
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    if (slot.interviewer.toString() !== currentUser._id.toString()) {
      return res.status(403).json({ message: "Only the poster can edit this slot" });
    }

    if (starttime && new Date(starttime) <= new Date()) {
      return res.status(400).json({ message: "starttime must be in the future" });
    }
    if (duration !== undefined && (!Number.isFinite(Number(duration)) || Number(duration) < 3 || Number(duration) > 240)) {
      return res.status(400).json({ message: "duration must be a number between 15 and 240 minutes" });
    }

    if (capacity !== undefined) {
      const bookedCount = slot.requests.filter((r) => r.status === "booked").length;
      if (Number(capacity) < bookedCount) {
        return res.status(400).json({
          message: `Capacity can't be less than the ${bookedCount} already booked`,
        });
      }
      slot.capacity = capacity;
      slot.status = bookedCount >= Number(capacity) ? "full" : "open";
    }

    if (title !== undefined) slot.title = title;
    if (description !== undefined) slot.description = description;
    if (topic !== undefined) slot.topic = topic;
    if (starttime !== undefined) slot.starttime = starttime;
    if (duration !== undefined) slot.duration = Number(duration);
    if (meetinglink !== undefined) slot.meetinglink = meetinglink;

    await slot.save();

    const affected = slot.requests.map((r) => r.user.toString());
    await Promise.all(
      affected.map((userId) =>
        notify(userId, slot._id, "rescheduled", `"${slot.title}" was rescheduled by the poster`)
      )
    );

    await slot.populate("interviewer");
    res.status(200).json(slot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to reschedule slot", error: err.message });
  }
}

export async function cancelSlot(req, res) {
  try {
    const { id } = req.params;
    const currentUser = req.currentUser;

    const slot = await Slot.findById(id);
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    if (slot.interviewer.toString() !== currentUser._id.toString()) {
      return res.status(403).json({ message: "Only the poster can cancel this slot" });
    }

    const affected = slot.requests.map((r) => r.user.toString());
    await Promise.all(
      affected.map((userId) =>
        notify(userId, slot._id, "cancelled_by_poster", `"${slot.title}" was cancelled by the poster`)
      )
    );

    await Slot.findByIdAndDelete(id);

    res.status(200).json({ message: "Slot cancelled" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to cancel slot", error: err.message });
  }
}