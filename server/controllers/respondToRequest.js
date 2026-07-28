import Slot from "../models/Slot.js";
import notify from "../utils/notify.js";

export async function acceptRequest(req, res) {
  try {
    const { id, userId } = req.params;
    const currentUser = req.currentUser;

    const slot = await Slot.findById(id);
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    if (slot.interviewer.toString() !== currentUser._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only the poster can accept requests" });
    }

    const request = slot.requests.find((r) => r.user.toString() === userId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    const bookedCount = slot.requests.filter(
      (r) => r.status === "booked",
    ).length;
    if (bookedCount >= slot.capacity) {
      return res.status(400).json({ message: "Slot is already full" });
    }

    request.status = "booked";

    const newBookedCount = slot.requests.filter(
      (r) => r.status === "booked",
    ).length;
    if (newBookedCount >= slot.capacity) {
      slot.status = "full";
    }

    await slot.save();
    await notify(
      userId,
      slot._id,
      "booked",
      `You're booked for "${slot.title}"`,
    );

    res.status(200).json({ message: "Request accepted" });
  } catch (err) {
    req.log.error(err);
    res
      .status(500)
      .json({ message: "Failed to accept request", error: err.message });
  }
}

export async function removeRequest(req, res) {
  try {
    const { id, userId } = req.params;
    const currentUser = req.currentUser;

    const slot = await Slot.findById(id);
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    const request = slot.requests.find((r) => r.user.toString() === userId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    const isPoster = slot.interviewer.toString() === currentUser._id.toString();
    const isSelf = currentUser._id.toString() === userId;

    if (isPoster && !isSelf) {
      if (request.status !== "interested") {
        return res
          .status(400)
          .json({ message: "Only interested requests can be declined" });
      }
      slot.requests = slot.requests.filter((r) => r.user.toString() !== userId);
      await slot.save();
      await notify(
        userId,
        slot._id,
        "declined",
        `The poster declined your request for "${slot.title}"`,
      );
      return res.status(200).json({ message: "Request declined" });
    }

    if (isSelf) {
      if (request.status !== "booked") {
        return res
          .status(400)
          .json({ message: "Only a booked request can be cancelled" });
      }
      slot.requests = slot.requests.filter((r) => r.user.toString() !== userId);
      if (slot.status === "full") slot.status = "open";
      await slot.save();

      const nextInterested = [...slot.requests]
        .filter((r) => r.status === "interested")
        .sort((a, b) => a.createdAt - b.createdAt)[0];

      const suggestion = nextInterested
        ? " Check the interested list to pick a replacement."
        : "";
      await notify(
        slot.interviewer,
        slot._id,
        "booking_cancelled",
        `A booking was cancelled for "${slot.title}".${suggestion}`,
      );
      return res.status(200).json({ message: "Booking cancelled" });
    }

    return res
      .status(403)
      .json({ message: "Not authorized to remove this request" });
  } catch (err) {
    req.log.error(err);
    res
      .status(500)
      .json({ message: "Failed to remove request", error: err.message });
  }
}
