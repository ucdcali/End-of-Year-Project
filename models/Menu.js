import mongoose from "mongoose";

const menuMealSchema = new mongoose.Schema({
  date: Date,
  meals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meal'
  }],
  meal:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meal'
  }
})
const menuSchema = new mongoose.Schema({
  meals: [menuMealSchema],
  month: String,
  year: String
});

export const Menu = mongoose.model('Menu', menuSchema);