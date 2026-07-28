
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import User from "./models/User.js";
import dotenv from "dotenv";
import auth from "./auth.js";
import { toNodeHandler } from "better-auth/node";
import path from "path";
import { fileURLToPath } from "url";
import { getCurrUser } from "./controllers/getCurrUser.js";

import getSlots from "./controllers/getSlots.js";
import createSlot from "./controllers/createSlot.js";
import requireAuth from "./middleware/requireAuth.js";
import { getPostedSlots, getRequestedSlots } from "./controllers/getMySlots.js";
import connectSlot from "./controllers/connectSlot.js";
import { acceptRequest, removeRequest } from "./controllers/respondToRequest.js";
import { getNotifications, markAsRead, markAllAsRead } from "./controllers/notifications.js";
import { rescheduleSlot, cancelSlot } from "./controllers/manageSlot.js";
import { getMyPendingFeedback, submitFeedback, getUserFeedback } from "./controllers/feedback.js";
import blockIfPendingFeedback from "./middleware/blockIfPendingFeedback.js";
import { getUserProfile, updateMyProfile } from "./controllers/userProfile.js";

dotenv.config();
const PORT=process.env.PORT || 8080;


const app=express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("trust proxy", 1);
app.use(
  cors({
    origin:[
     "http://localhost:5173",
    process.env.BETTER_AUTH_URL,
  ].filter(Boolean),
    credentials: true,
  })
);
app.use(express.json());

mongoose
  .connect(process.env.ATLASDB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });


app.all("/api/auth/*path", toNodeHandler(auth));
app.use(express.static(path.join(__dirname, "../client/dist")));


app.post("/api/users/sync",async(req,res)=>{
console.log("inside sync ");

   const session = await auth.api.getSession({
        headers: req.headers,
    });
   if(session){
     console.log(session.user.email)
    const curruser= await User.findOne({
      authUserId:session.user.id
    })

    if(!curruser){
      await User.create({
        username:session.user.name,
        email:session.user.email,
        authUserId:session.user.id

      })
    }
    res.json({ success: true });
   }else{
    return res.status(401).json({ success: false, message: "Unauthorized" });
   }
    
})


app.get("/api/users/me", getCurrUser);
app.get("/api/slots",requireAuth,getSlots)
app.post("/api/slots",requireAuth, blockIfPendingFeedback, createSlot);

app.get("/api/slots/mine/posted", requireAuth, getPostedSlots);
app.get("/api/slots/mine/requested", requireAuth, getRequestedSlots);
app.post("/api/slots/:id/connect", requireAuth, blockIfPendingFeedback, connectSlot);
app.patch("/api/slots/:id/requests/:userId/accept", requireAuth, acceptRequest);
app.delete("/api/slots/:id/requests/:userId", requireAuth, removeRequest);
app.get("/api/notifications", requireAuth, getNotifications);
app.patch("/api/notifications/read-all", requireAuth, markAllAsRead);
app.patch("/api/notifications/:id/read", requireAuth, markAsRead);
app.put("/api/slots/:id", requireAuth, rescheduleSlot);
app.delete("/api/slots/:id", requireAuth, cancelSlot);
app.get("/api/feedback/pending", requireAuth, getMyPendingFeedback);
app.post("/api/feedback", requireAuth, submitFeedback);
app.get("/api/feedback/user/:userId", requireAuth, getUserFeedback);
app.get("/api/users/:id/profile", requireAuth, getUserProfile);
app.put("/api/users/me/profile", requireAuth, updateMyProfile);

app.get("/api/test",(req,res)=>{
    res.json({message:"hello everyone"});
})



app.get("/*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(PORT,()=>{
    console.log("listening");
})