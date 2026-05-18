import express from "express";
import * as mealController from "../controllers/mealController.js";
import * as menuController from "../controllers/menuController.js";

import { Meal } from "../models/Meal.js";
import { Menu } from '../models/Menu.js'

export const router = express.Router();

//homepage
router.get("/", mealController.homePage);
//adminpage
router.get("/admin", mealController.adminPage);
//create a meal
router.post("/admin/createMeal", mealController.createMeal);
//edit a meal
router.post("/admin/edit/:id", mealController.editMeal);
//delet a meal
router.post("/admin/delete/:id", mealController.deleteMeal);

router.get('/menu', menuController.getMenu);

router.post('/admin/createMenu', menuController.createMenu)