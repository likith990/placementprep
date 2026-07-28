

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const feedbackSchema = new Schema(
  {
    slot: {
      type: Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
    },
    fromUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    noShow: {
      type: Boolean,
      default: false,
    },
    ratings: {
      communication: {
        type: Number,
        min: 1,
        max: 5,
        required: function () {
          return !this.noShow;
        },
      },
      technical: {
        type: Number,
        min: 1,
        max: 5,
        required: function () {
          return !this.noShow;
        },
      },
      problemSolving: {
        type: Number,
        min: 1,
        max: 5,
        required: function () {
          return !this.noShow;
        },
      },
    },
    comment: {
      type: String,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

feedbackSchema.index({ slot: 1, fromUser: 1, toUser: 1 }, { unique: true });

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;