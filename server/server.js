
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import User from "./models/User.js";
import dotenv from "dotenv";
import auth from "./auth.js";
import { toNodeHandler } from "better-auth/node";
import path from "path";
import { fileURLToPath } from "url";


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
  ],
    credentials: true,
  })
);


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
    console.log(session.user.emial)
    res.json({ success: true });
})

app.get("/api/test",(req,res)=>{
    res.json({message:"hello everyone"});
})

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(PORT,()=>{
    console.log("listening");
})