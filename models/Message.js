import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  message: String
});

export default mongoose.model("Message", messageSchema);