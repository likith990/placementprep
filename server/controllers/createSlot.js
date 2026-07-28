

import Slot from "../models/Slot.js";

export default async function createSlot(req, res) {
  try {
    const { title, description, topic, capacity, starttime, duration, meetinglink } = req.body;

    if (!title || !starttime || !meetinglink) {
      return res.status(400).json({ message: "title, starttime, and meetinglink are required" });
    }
    if (new Date(starttime) <= new Date()) {
      return res.status(400).json({ message: "starttime must be in the future" });
    }
    if (!Number.isFinite(Number(duration)) || Number(duration) < 3 || Number(duration) > 240) {
      return res.status(400).json({ message: "duration must be a number between 15 and 240 minutes" });
    }
    if (capacity !== undefined && Number(capacity) < 1) {
      return res.status(400).json({ message: "capacity must be at least 1" });
    }

  const newSlot = new Slot({
      title,
      description,
      topic,
      capacity,
      starttime,
      duration: Number(duration),
      meetinglink,
      interviewer: req.currentUser._id,
    });

    await newSlot.save();
    await newSlot.populate("interviewer");

    res.status(201).json(newSlot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create slot", error: err.message });
  }
}