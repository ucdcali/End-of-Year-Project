import mongoose from 'mongoose';

import express from 'express';
import { Meal } from '../models/Meal.js';

export const router = express.Router();


router.get('/', async (req, res, next) => {
    try {
        const meals = await Meal.find();

        res.render('index', {
            meal
        })
    }
    catch (err) {
        next(err)
    }
})