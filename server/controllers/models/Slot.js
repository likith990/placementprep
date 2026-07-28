
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const requestSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["interested", "booked"],
      default: "interested",
    },
    message: String,
    resumeLink: String,
  },
  { timestamps: true }
);

const slotSchema = new Schema({
  title: String,
  description: String,
  topic: String,
  interviewer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  capacity: {
    type: Number,
    default: 2,
  },
  status: {
    type: String,
    enum: ["open", "full", "completed", "cancelled"],
    default: "open",
  },
  requests: [requestSchema],
  starttime: Date,
  duration: {
    type: Number,
    required: true,
    min: 3,
    max: 240,
  },
  meetinglink: String,
});

const Slot = mongoose.model("Slot", slotSchema);
export default Slot;