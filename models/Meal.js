import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  title: String,
  diet: String,
  img: String,
});

export const Meal = mongoose.model('Meal', mealSchema);
