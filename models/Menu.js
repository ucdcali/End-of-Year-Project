import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  Meals:[{
    date: Date
  }]
});

export const Menu = mongoose.model('Menu', menuSchema);
