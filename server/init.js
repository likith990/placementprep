
import mongoose from "mongoose";
const User=require("./models/User");
require("dotenv").config();

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

  add();