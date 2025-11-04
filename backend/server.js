import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

const app = express();
dotenv.config();
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

app.use(express.json());
app.use(cors({ origin: "*" }));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connect with Database");
  } catch (err) {
    console.log("failed to connect with db", err);
  }
};

app.use("/api", chatRoutes);
// app.get("/text", async (req, res) => {
//   const message = req.body.message;
//   let data = "write a 50 word poem on love";
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: message,
//   });

//   //console.log("response", response);
//   console.log("response.text", response.text);
//   //console.log("response.josn", response);
//  // res.send(response);
//   res.json({"response" : response.text})
// });
// // async function main() {
// //   const response = await ai.models.generateContent({
// //     model: "gemini-2.5-flash",
// //     contents: data,
// //   });

// //   console.log(response.text);
// // }

// // main();

app.listen(process.env.PORT || 3000, () => {
  console.log("server is listening on port 3000");
  connectDB();
});
