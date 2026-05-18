import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  title: String,
  description: String,
  diet: [{ 
    type: String,
    enum: ['V', 'VG', 'GF', 'DF', 'NF']
  }],
  img: String
});

export const Meal = mongoose.model('Meal', mealSchema);
