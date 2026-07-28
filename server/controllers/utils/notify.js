import Notification from "../models/notificationSchema.js";
import User from "../models/User.js";
import Slot from "../models/Slot.js";
import logger from "./logger.js";
import sendEmail from "./sendEmail.js";

const EMAIL_SUBJECTS = {
  connect_sent: "Connection request sent",
  connect_received: "New connection request on PlacementPrep",
  booked: "You're booked for a mock interview",
  declined: "Your request was declined",
  cancelled_by_poster: "A slot you booked was cancelled",
  rescheduled: "A slot you booked was rescheduled",
  booking_cancelled: "A booking on your slot was cancelled",
  reminder: "Upcoming mock interview reminder",
};

// Only include meeting details for notifications where the meeting is
// still happening — not for declines/cancellations.
const TYPES_WITH_MEETING_INFO = new Set(["booked", "rescheduled", "reminder"]);

function slotDetailsText(slot) {
  const lines = [
    `Start time: ${new Date(slot.starttime).toUTCString()} (UTC)`,
    `Duration: ${slot.duration} minutes`,
  ];
  if (slot.meetinglink) lines.push(`Meeting link: ${slot.meetinglink}`);
  return lines.join("\n");
}

function slotDetailsHtml(slot) {
  const parts = [
    `<p><strong>Start time:</strong> ${new Date(slot.starttime).toUTCString()} (UTC)</p>`,
    `<p><strong>Duration:</strong> ${slot.duration} minutes</p>`,
  ];
  if (slot.meetinglink) {
    parts.push(
      `<p><strong>Meeting link:</strong> <a href="${slot.meetinglink}">${slot.meetinglink}</a></p>`,
    );
  }
  return parts.join("");
}

export default async function notify(userId, slotId, type, message) {
  try {
    await Notification.create({ user: userId, slot: slotId, type, message });
  } catch (err) {
    logger.error({ err }, "Failed to create notification");
  }

  User.findById(userId)
    .then(async (user) => {
      if (!user?.email) return;

      let text = message;
      let html = `<p>${message}</p>`;

      if (TYPES_WITH_MEETING_INFO.has(type) && slotId) {
        const slot = await Slot.findById(slotId).select(
          "starttime duration meetinglink",
        );
        if (slot) {
          text = `${message}\n\n${slotDetailsText(slot)}`;
          html = `<p>${message}</p>${slotDetailsHtml(slot)}`;
        }
      }

      return sendEmail({
        to: user.email,
        subject: EMAIL_SUBJECTS[type] || "PlacementPrep notification",
        text,
        html,
      });
    })
    .catch((err) => logger.error({ err }, "Failed to send notification email"));
}
