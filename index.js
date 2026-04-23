import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Message from "./models/Message.js";
import User from "./models/User.js"; 

const app = express();

// MIDDLEWARE
dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

// ROUTES

// HOME PAGE
app.get("/", async (req, res) => {
  try {
    const messages = await Message.find();
    const users = await User.find();
    res.render("index", { messages, users });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading page");
  }
});

// CREATE MESSAGE
app.post("/messages", async (req, res) => {
  try {
    await Message.create({ message: req.body.message });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating message");
  }
});

// DELETE MESSAGE
app.post("/messages/delete/:id", async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting message");
  }
});

// CREATE USER
app.post("/users", async (req, res) => {
  try {
    await User.create({ name: req.body.name });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating user");
  }
});

// DELETE USER
app.post("/users/delete/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting user");
  }
});

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