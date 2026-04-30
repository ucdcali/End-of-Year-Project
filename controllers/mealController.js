import { Meal } from '../models/Meal.js'
//import { Menu } from '../models/Menu.js'

export const homePage = async (req, res, next) => {
    try {
      res.redirect("/admin")
        // const meals = await Meal.find()
        // if (date = meals.date) {
        //     res.json(meals[1])
        // }
        // res.render('index', {
        //   title: "Commons App",
        //   meals
        // })
    }
    catch (err) {
        next(err)
    }
}

export const adminPage = async (req, res, next) => {
  try{
  const meals = await Meal.find()
    if (date = meals.date) {
    res.json(meals[1])
    }
    res.render('index', {
    title: "Commons App",
    meals
    })
  }
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

export const deleteMeal = async(req, res, next) => {
  try {
    const meal = await Meal.findByIdAndDelete(req.params.id);
    res.redirect('/admin')
  } catch (err) {
    next(err)
  }
}

export const editMeal = async(req, res, next) => {
  try{
    const meal = await Meal.findById(req.params.id);
    res.render("edit", { meal });
    }
  catch (err) {
    next(err)
  }
}