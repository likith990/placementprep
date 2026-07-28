
import Slot from "../models/Slot.js";
import { isSlotPast } from "../utils/SlotTime.js";
export default async function getSlots(req, res) {
  try {
    const allSlots = await Slot.find({ status: { $ne: "completed" } })
      .populate("interviewer")
      .populate("requests.user")
      .lean();

    const slots = allSlots.filter((slot) => !isSlotPast(slot));

    const currentUserId = req.currentUser._id.toString();

    const sanitized = slots.map((slot) => {
      const requests = slot.requests || [];
      const bookedCount = requests.filter((r) => r.status === "booked").length;
      const interestedCount = requests.filter((r) => r.status === "interested").length;
      const myRequest = requests.find((r) => r.user?._id?.toString() === currentUserId) || null;
      const isOwner = slot.interviewer?._id?.toString() === currentUserId;

      const { requests: _omit, ...rest } = slot;

      return {
        ...rest,
        bookedCount,
        interestedCount,
        isOwner,
        myRequest: myRequest
          ? { status: myRequest.status, message: myRequest.message, resumeLink: myRequest.resumeLink }
          : null,
      };
    });

    res.status(200).json(sanitized);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch slots", error: err.message });
  }
}