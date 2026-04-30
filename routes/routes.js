import express from "express";
import * as mealController from "../controllers/messageController.js";
import { Meal } from "../models/Meal.js";
export const router = express.Router();
//import { Menu } from '../models/Menu.js'

//router.get('/', async (req, res, next) => {
try {
  const meals = await Meal.find();
  //console.log(meals)
  res.json(meals[1]);
} catch (err) {
  next(err);
}
//})

//homepage
router.get("/", mealController.homePage);
//adminpage
router.get("/admin", mealController.adminPage);
//create a meal
router.post("/admin/create", mealController.createMeal);
//edit a meal
router.post("/admin/edit/:id", mealController.editMeal);
//delet a meal
router.post("/admin/delete/:id", mealController.deleteMeal);
