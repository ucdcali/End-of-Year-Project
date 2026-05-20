import express from "express";
import * as mealController from "../controllers/mealController.js";
import * as menuController from "../controllers/menuController.js";
import * as suggestionController from "../controllers/suggestionController.js";

import { Meal } from "../models/Meal.js";
import { Menu } from '../models/Menu.js';
import { Suggestion } from "../models/Suggestion.js";

export const router = express.Router();

// STUDENT PAGES
//homepage - displays today's meal
router.get("/", mealController.homePage);
// student menu - displays full monthly menu
router.get('/menu', menuController.displayMonthlyMenu);
// meal detail - displays single meal details
router.get('/meals/:id', mealController.displayMealDetail);
// create suggestion
router.post('/suggestion', suggestionController.submitSuggestion);

// ADMIN PAGES
//adminpage
router.get("/admin", mealController.adminPage);
//create a meal
router.post("/admin/createMeal", mealController.createMeal);
//edit a meal
router.get("/meals/edit/:id", mealController.editMeal);
router.post("/meals/edit/:id", mealController.saveEdits)
//view suggestions
router.get('/suggestions', suggestionController.viewSuggestions)

router.get('/login', (req, res) => {
  res.render('login');
//   res.send('this is working')
});

// Login submit
router.post('/login', async (req, res) => {
  try {
    const password = req.body.password || '';
    if (password === process.env.PASSWORD) {
            res.redirect('/admin');
    }
    else {
        res.redirect('/')
    }
  } catch (err) {
    next(err);
  }
});


//delete a meal
router.post("/meals/delete/:id", mealController.deleteMeal);

// MENU MANAGEMENT
router.post('/admin/createMenu', menuController.createMenu);
router.get('/admin/editMenu/:id', menuController.editMenuPage);
router.post('/admin/editMenu/:id', menuController.updateMenu);
