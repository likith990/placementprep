
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import User from "./models/User.js";
import dotenv from "dotenv";
import auth from "./auth.js";
import { toNodeHandler } from "better-auth/node";

dotenv.config();


const app=express();
app.use(
  cors({
    origin: "http://localhost:5173",
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


app.get("/",(req,res)=>{
    res.send("hello everyone");
})

app.get("/api/test",(req,res)=>{
    res.json({message:"hello everyone"});
})

app.listen(8080,()=>{
    console.log("listening");
})