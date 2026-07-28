import Slot from "../models/Slot.js";

export async function getPostedSlots(req, res) {
  try {
    const slots = await Slot.find({ interviewer: req.currentUser._id })
      .populate("interviewer")
      .populate("requests.user")
      .sort({ starttime: 1 });

    res.status(200).json(slots);
  } catch (err) {
    req.log.error(err);
    res
      .status(500)
      .json({ message: "Failed to fetch posted slots", error: err.message });
  }
}

export async function getRequestedSlots(req, res) {
  try {
    const currentUserId = req.currentUser._id;

    const slots = await Slot.find({ "requests.user": currentUserId })
      .populate("interviewer")
      .sort({ starttime: 1 })
      .lean();

    const trimmed = slots.map((slot) => {
      const myRequest = slot.requests.find(
        (r) => r.user.toString() === currentUserId.toString(),
      );
      const { requests, ...rest } = slot;
      return { ...rest, myRequest };
    });

    res.status(200).json(trimmed);
  } catch (err) {
    req.log.error(err);
    res
      .status(500)
      .json({ message: "Failed to fetch requested slots", error: err.message });
  }
}
