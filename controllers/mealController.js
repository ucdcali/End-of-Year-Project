import mongoose from 'mongoose';
import { Meal } from '../models/Meal.js'
import { Menu } from '../models/Menu.js'

const DIET = ['V', 'VG', 'GF', 'DF', 'NF'];

export const homePage = async (req, res) => {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
 
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const menu = await Menu.findOne({
        meals: {
          $elemMatch:{
            date: {
              $gte: startOfDay,
              $lte: endOfDay
            }
         }
        
       }
      });
 
    if (!menu) {
      return res.send('No meal found for today.');
    }
    
    console.log("startOfDay:", startOfDay);
console.log("endOfDay:", endOfDay);

menu.meals.forEach(m => {
  console.log("meal date:", m.date);
});

    const todaysMeal = menu.meals.find(m =>
      m.date >= startOfDay && m.date <= endOfDay
    )

    const mealInfo = await Meal.findById(todaysMeal.meal);

    res.render('/index', {
      mealInfo,
      startOfDay,
      menu
    })
    }
    catch (err) {
        console.log(err)
    }
}

export const adminPage = async (req, res, next) => {
  try{
    const meals = await Meal.find()
    
    res.render('admin', {
     title: "Commons App",
    meals
       })}
    catch (err) {
        next(err)
    }
}


export const createMeal = async (req, res, next) => {
    try {
      const { title, diet, img } = req.body;
      await Meal.create({ title, diet, img });     
      res.redirect("/admin")
    }
    catch (err) {
        next(err)
    }
}

export const meal = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      res.status(404).send('Meal not found');
      return;
    }

    res.render('meals/:id', {
      title: meal.title,
      meal
    });
  } catch (err) {
    next(err);
  }
}

export const deleteMeal = async(req, res, next) => {
  try {
    const meal = await Meal.findByIdAndDelete(req.params.id);
    res.redirect('/meals')
  } catch (err) {
    next(err)
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
    const diet = req.body.diet
    const img = req.body.img
    const updated = await Meal.findByIdAndUpdate (
    req.params.id,
    {title, diet, img},
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