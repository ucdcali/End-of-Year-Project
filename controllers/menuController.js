import { Menu } from '../models/Menu.js'
import { Meal } from '../models/Meal.js'

export const displayMonthlyMenu = async (req, res) => {
    try {
        // Get current month and year or from query params
        const now = new Date();
        const month = req.query.month || now.toLocaleString('default', { month: 'long' }).toLowerCase();
        const year = req.query.year || now.getFullYear().toString();
        
        const menu = await Menu.findOne({
          month: month,
          year: year,
        })
          .populate("meals.meals")
          .populate("meals.meal");
        
        if (!menu) {
            return res.render("menu", {
              noMenu: true,
              month,
              year,
              meals1: [],
              meals2: [],
            });
        }

        res.render("menu", {
          noMenu: false,
          month,
          year,
          meals1: menu.meals1,
          meals2: menu.meals2,
          allMeals: menu.meals,
        });
    } catch (error) {
        console.log(error);
        res.render("menu", {
          noMenu: true,
          error: error.message,
          meals1: [],
          meals2: [],
        });
    }
}

function getMonthIndex(monthName) {
    const months = {
        january: 0,
        february: 1,
        march: 2,
        april: 3,
        may: 4,
        june: 5,
        july: 6,
        august: 7,
        september: 8,
        october: 9,
        november: 10,
        december: 11
    };
    return months[monthName.toLowerCase()] ?? 0;
}

function buildMenuDays(month, year, body) {
    const monthIndex = getMonthIndex(month);
    const meals1 = [];
    const meals2 = [];

    for (let day = 1; day <= 31; day++) {
        const mealId1 = body[`meal_day_${day}_1`];
        const mealId2 = body[`meal_day_${day}_2`];
        const dayMeals = [];

        if (mealId1) dayMeals.push(mealId1);
        if (mealId2) dayMeals.push(mealId2);
        if (dayMeals.length === 0) continue;

        const date = new Date(year, monthIndex, day);
        if (date.getMonth() !== monthIndex) continue;

        meals1.push({
          date,
          meals: dayMeals,
        });
    }
for (let day = 1; day <= 31; day++) {
  const mealId = body[`meal2_day_${day}`];
  if (!mealId) continue;

  const date = new Date(year, monthIndex, day);
  if (date.getMonth() !== monthIndex) continue;

  meals2.push({
    date,
    meal: mealId,
  });
}
return (meals1, meals2);
}

export const createMenu = async (req, res) => {
    try {
        const { month, year } = req.body;
        const { meals1, meals2 } = buildMenuDays(month, year, req.body);

        const existingMenu = await Menu.findOne({ month, year });
        if (existingMenu) {
            existingMenu.meals1 = meals1;
            existingMenu.meals2 = meals2;
            await existingMenu.save();
        } else {
            await Menu.create({
              month,
              year,
              meals1,
              meals2,
            });
        }

        res.redirect('/admin');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error creating/updating menu');
    }
}

export const editMenuPage = async (req, res, next) => {
    try {
        const menu = await Menu.findById(req.params.id)
          .populate("meals.meals")
          .populate("meals.meal");
        if (!menu) {
          return res.status(404).send("Menu not found");
        }
        const menuDays = Array.from({ length: 31 }, (_, index) => {
            const day = index + 1;
            const entry = menu.meals.find(
              (item) => new Date(item.date).getDate() === day,
            );
            const mealIds = [];

            if (entry) {
              if (Array.isArray(entry.meals) && entry.meals.length > 0) {
                mealIds.push(...entry.meals.map((m) => String(m._id ?? m)));
              } else if (entry.meal) {
                mealIds.push(String(entry.meal._id ?? entry.meal));
              }
            }

            return {
              day,
              meal1Id: mealIds[0] || "",
              meal2Id: mealIds[1] || "",
            };
        });

        res.render('editMenu', {
            menu,
            allMeals,
            menuDays
        });
    } catch (err) {
        next(err);
    }
}

export const updateMenu = async (req, res, next) => {
    try {
        const { month, year } = req.body;
        const meals1 = buildMenuDays(month, year, req.body);
        const meals2 = buildMenuDays(month, year, req.body);
        const menu = await Menu.findById(req.params.id);

        if (!menu) {
            return res.status(404).send('Menu not found');
        }

        menu.month = month;
        menu.year = year;
        menu.meals1 = meals1;
        menu.meals2 = meals2;
        await menu.save();

        res.redirect('/admin');
    } catch (err) {
        next(err);
    }
}
