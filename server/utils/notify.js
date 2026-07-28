
import Notification from "../models/notificationSchema.js";

export default async function notify(userId, slotId, type, message) {
  try {
    await Notification.create({ user: userId, slot: slotId, type, message });
  } catch (err) {
    console.error("Failed to create notification:", err);
  }
}