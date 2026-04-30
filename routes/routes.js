import express from 'express';
import { Meal } from '../models/Meal.js'
//import { Menu } from '../models/Menu.js'

export const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const meals = await Meal.find()
        //console.log(meals)
        res.json(meals[1])
        res.render("index", { meals });
    }
    catch (err) {
        next(err)
    }
})