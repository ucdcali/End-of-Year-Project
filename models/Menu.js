import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  Meals:[{
    date 
  }]
});

export const Menu = mongoose.model('Menu', menuSchema);
