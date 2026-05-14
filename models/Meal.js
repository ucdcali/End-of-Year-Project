import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  title: String,
  diet: {
  type: Array
},
  img: String
});

export const Meal = mongoose.model('Meal', mealSchema);
