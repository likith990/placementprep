
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  email: String,
  authUserId: {
    type: String,
    required: true,
    unique: true,
  },
  bio: {
    type: String,
    maxlength: 300,
    default: "",
  },
  skills: {
    type: [String],
    default: [],
  },
  experienceLevel: {
    type: String,
    enum: ["student", "junior", "mid", "senior"],
  },
  targetRole: {
    type: String,
    default: "",
  },
  links: {
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    portfolio: { type: String, default: "" },
  },
});

const User = mongoose.model("User", userSchema);

export default User;