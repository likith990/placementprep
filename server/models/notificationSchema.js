

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slot: {
      type: Schema.Types.ObjectId,
      ref: "Slot",
    },
    type: {
      type: String,
      enum: [
        "connect_sent",
        "connect_received",
        "booked",
        "declined",
        "cancelled_by_poster",
        "rescheduled",
        "booking_cancelled",
        "reminder",
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;