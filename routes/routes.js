import express from "express";
import * as mealController from "../controllers/mealController.js";
import * as userController from "../controllers/userController.js";
import { Meal } from "../models/Meal.js";
export const router = express.Router();
//import { Menu } from '../models/Menu.js'



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
//display login page
router.get("/loginPage", userController.loginPage);
//login(Shocking)
router.post("/login", userController.login);
//log out
router.post("/logout", userController.logout);
//login page

