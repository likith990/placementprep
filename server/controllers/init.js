
import mongoose from "mongoose";
import Slot from "./models/Slot.js";
import dotenv from "dotenv";
dotenv.config();


mongoose
  .connect(process.env.ATLASDB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

  async function add(){
    await User.deleteMany({});

    const user = new User({
    username: "Likith",
    email: "likith@example.com",
});

await user.save();
console.log("User saved");
  }

 const fakeSlot = {
  title: "DSA Mock Interview",

  interviewer: "6881f4d8c2b9b8d7a2f6a123",

  capacity: 2,

  bookedUsers: [
    "6881f4d8c2b9b8d7a2f6b111",
    "6881f4d8c2b9b8d7a2f6b222",
  ],

  interestedUsers: [
    "6881f4d8c2b9b8d7a2f6c333",
    "6881f4d8c2b9b8d7a2f6c444",
  ],

  starttime: new Date("2026-07-30T15:00:00.000Z"),

  duration: "60",

  meetinglink: "https://meet.google.com/abc-defg-hij",
};

async function addSlot() {
  const newslot=new Slot(fakeSlot);

  await newslot.save();
  console.log("completied adding")
  
}
addSlot();
