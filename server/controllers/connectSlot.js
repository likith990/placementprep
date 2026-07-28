
import Slot from "../models/Slot.js";
import notify from "../utils/notify.js";

export default async function connectSlot(req, res) {
  try {
    const { id } = req.params;
    const { message, resumeLink } = req.body;
    const currentUser = req.currentUser;

    const slot = await Slot.findById(id);
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    if (slot.interviewer.toString() === currentUser._id.toString()) {
      return res.status(400).json({ message: "You can't connect to your own slot" });
    }

    const alreadyRequested = slot.requests.some(
      (r) => r.user.toString() === currentUser._id.toString()
    );
    if (alreadyRequested) {
      return res.status(400).json({ message: "You've already requested this slot" });
    }

    slot.requests.push({
      user: currentUser._id,
      status: "interested",
      message,
      resumeLink,
    });
    await slot.save();

    await notify(currentUser._id, slot._id, "connect_sent", `You connected with "${slot.title}"`);
    await notify(slot.interviewer, slot._id, "connect_received", `${currentUser.username} wants to connect for "${slot.title}"`);

    res.status(201).json({ message: "Request sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to connect", error: err.message });
  }
}