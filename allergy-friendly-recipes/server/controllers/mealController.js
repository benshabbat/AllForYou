import Meal from '../models/Meal.js';
import { getSubstituteOptions } from '../services/externalAPI.js';


// פונקציה לקבלת כל התפריטים
export const getMeals = async (req, res) => {
  const { allergy, search, sort } = req.query;

  try {
    let meals = await Meal.find();
    
    if (search) {
      meals = meals.filter(meal => meal.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (allergy) {
      meals = meals.filter(meal => !meal.allergies.includes(allergy));
    }

    if (sort === 'asc') {
      meals = meals.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'desc') {
      meals = meals.sort((a, b) => b.name.localeCompare(a.name));
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
export const fetchSubstituteOptions = async (req, res) => {
  const { ingredient } = req.query;

  try {
    const options = await getSubstituteOptions(ingredient);
    res.status(200).json(options);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
