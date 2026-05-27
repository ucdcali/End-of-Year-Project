import mongoose from 'mongoose';
import { Meal } from '../models/Meal.js'
import { Menu } from '../models/Menu.js'
import { Suggestion } from '../models/Suggestion.js'


const DIET = ['V', 'VG', 'GF', 'DF', 'NF'];

export const homePage = async (req, res) => {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
 
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const now = new Date();
      const currentMonth = now.toLocaleString('default', { month: 'long' }).toLowerCase();
      const currentYear = now.getFullYear().toString();

      const menu = await Menu.findOne({
        meals: {
          $elemMatch: {
            date: {
              $gte: startOfDay,
              $lte: endOfDay,
            },
          },
        },
      }).populate([meals1.meal, meals2.meal]);
 
    if (!menu) {
      return res.render('index', {
        meals: [],
        noMealToday: true
      });
    }
    
    // Check both meals1 and meals2 for today's date
    const todaysMeal1 = menu.meals1.find(m =>
      new Date(m.date) >= startOfDay && new Date(m.date) <= endOfDay
    );
    
    const todaysMeal2 = menu.meals2.find(m =>
      new Date(m.date) >= startOfDay && new Date(m.date) <= endOfDay
    );

    // Collect both meals if they exist
    const meals = [];
    if (todaysMeal1?.meal) meals.push(todaysMeal1.meal);
    if (todaysMeal2?.meal) meals.push(todaysMeal2.meal);

    if (meals.length === 0) {
      return res.render('index', {
        meals: [],
        noMealToday: true
      });
    }

    res.render('index', {
      meals,
      noMealToday: false
    })
    }
    catch (err) {
        console.log(err)
        res.render('index', {
          meals: [],
          noMealToday: true,
          error: err.message
        })
    }
}

export const adminPage = async (req, res, next) => {
  try {
    const meals = await Meal.find();
    const meals1 = await Meal.find();
    const meals2 = await Meal.find();
    const menus = await Menu.find().sort({ year: -1, month: 1 });
    const suggestions = await Suggestion.find()
    res.render("admin", {
      title: "Commons App",
      meals,
      meals1,
      meals2,
      menus,
      suggestions,
    });
  } catch (err) {
    next(err);
  }
}


export const createMeal = async (req, res, next) => {
    try {
      const { title, description, diet, img } = req.body;
      const meal = await Meal.create({ title, description, diet, img }); 
      console.log(meal)    
      res.redirect("/admin")
    }
    catch (err) {
        next(err)
    }
}

export const displayMealDetail = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).render('error', {
        message: 'Meal not found'
      });
    }

    res.render('displayMeal', {
      title: meal.title,
      meal
    });
  } catch (err) {
    next(err);
  }
}

export const deleteMeal = async(req, res, next) => {
  try {
    await Meal.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
  } catch (err) {
    next(err);
  }
}

export const editMeal = async(req, res, next) => {
  try{
    const meal = await Meal.findById(req.params.id);
    res.render("edit", { meal, title:"editing" });
    }
  catch (err) {
    next(err)
  }
}

export const saveEdits = async (req,res, next) => {
  try {
    const title = req.body.title
    const description = req.body.description
    const diet = req.body.diet
    const img = req.body.img
    const updated = await Meal.findByIdAndUpdate (
    req.params.id,
    {title, description, diet, img},
    {new: true, runValidators:true}

);
  if(!updated) return res.status(404).send('Meal not updated.');
  res.redirect(`/meals/${updated._id}`)
  }
  catch (err){
    next(err)
  }
}


export const allMeals = async(req, res, next) => {
  try{
    const meals = await Meal.find();
    res.render("meals", { 
      meals,
      title: "All Meals"
     });
    }
  catch (err) {
    next(err)
  }
}