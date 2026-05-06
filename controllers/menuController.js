import { Menu } from '../models/Menu.js'

export const getMenu = async (req, res ) => {
    try {
        const menu = await Menu.find({month: 'May'})
        res.json(menu)
    } catch (error) {
       console.log(error) 
    }
}

export const createMenu = async (req, res) => {
    try {
        await Menu.create({
            month: req.body.month,
            year: req.body.year,
            meals:[{
                date: req.body.meal.date,
                meal: req.body.meal._id
            }
        ]
        });
        res.redirect('/admin')
    } catch (err) {
        console.log(err)
    }
}