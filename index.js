import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { router } from './routes/routes.js';

const app = express();

// MIDDLEWARE
dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));


app.use('/', router);

// START SERVER ONLY AFTER DB CONNECTS
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port http://localhost:${process.env.PORT}`);
    });

  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  }
}

startServer();