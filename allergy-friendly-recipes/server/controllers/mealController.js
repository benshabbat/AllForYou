import Meal from '../models/Meal.js';

// פונקציה לקבלת כל התפריטים
export const getMeals = async (req, res) => {
  const { allergy } = req.query;
  try {
    let meals = await Meal.find();
    if (allergy) {
      meals = meals.filter(meal => !meal.allergies.includes(allergy));
    }
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// פונקציה להוספת תפריט חדש
export const addMeal = async (req, res) => {
  const { name, ingredients, substitutes, allergies } = req.body;

  const newMeal = new Meal({
    name,
    ingredients,
    substitutes,
    allergies,
  });

  try {
    const savedMeal = await newMeal.save();
    res.status(201).json(savedMeal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};