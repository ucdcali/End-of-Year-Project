import express from "express";
import * as mealController from "../controllers/mealController.js";
import * as menuController from "../controllers/menuController.js";

import { Meal } from "../models/Meal.js";
export const router = express.Router();
import { Menu } from '../models/Menu.js'


//homepage
router.get("/", mealController.homePage);
//adminpage
router.get("/admin", mealController.adminPage);
//create a meal
router.post("/admin/createMeal", mealController.createMeal);
//edit a meal
router.get("/meals/edit/:id", mealController.editMeal);
router.post("/meals/:id", mealController.saveEdits)

//delete a meal
router.post("/meals/delete/:id", mealController.deleteMeal);

router.get('meals/:id', mealController.meal)

router.get('/menu', menuController.getMenu);

router.post('/admin/createMenu', menuController.createMenu)

router.get('/meals', mealController.allMeals)