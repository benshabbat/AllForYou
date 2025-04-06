import {
  getAllRecipes as fetchAllRecipes,
  getRecipeById as fetchRecipeById,
  createRecipe as createNewRecipe,
  updateRecipe as modifyRecipe,
  deleteRecipe as removeRecipe,
  rateRecipe as rateExistingRecipe,
  toggleFavorite as toggleRecipeFavorite,
  getSearchSuggestions as fetchSearchSuggestions,
  getPopularRecipesService as fetchPopularRecipes
} from "../../services/recipeService.js";
import { ErrorHandler } from "../../utils/errorHandler.js";

// פונקציה לקבלת כל המתכונים
export const getAllRecipes = async (req, res, next) => {
  try {
    const recipes = await fetchAllRecipes(req.query);
    res.json(recipes);
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
};

// פונקציה לקבלת מתכון לפי מזהה
export const getRecipe = async (req, res, next) => {
  try {
    const recipe = await fetchRecipeById(req.params.id);
    if (!recipe) {
      return next(new ErrorHandler("Recipe not found", 404));
    }
    res.json(recipe);
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
};

// פונקציה ליצירת מתכון חדש
export const createRecipe = async (req, res, next) => {
  try {
    const recipe = await createNewRecipe(req.body, req.user);
    res.status(201).json(recipe);
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
};

// פונקציה לעדכון מתכון קיים
export const updateRecipe = async (req, res, next) => {
  try {
    const recipe = await modifyRecipe(req.params.id, req.body, req.user);
    if (!recipe) {
      return next(new ErrorHandler("Recipe not found", 404));
    }
    res.json(recipe);
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
};

// פונקציה למחיקת מתכון
export const deleteRecipe = async (req, res, next) => {
  try {
    const result = await removeRecipe(req.params.id, req.user);
    if (!result) {
      return next(new ErrorHandler("Recipe not found", 404));
    }
    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
};

// פונקציה לדרוג מתכון
export const rateRecipe = async (req, res, next) => {
  try {
    const { rating } = req.body;
    const recipe = await rateExistingRecipe(req.params.id, req.user.id, rating);
    res.json({ averageRating: recipe.averageRating });
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
};

// פונקציה להוספה או הסרה מהמועדפים
export const toggleFavorite = async (req, res, next) => {
  try {
    const result = await toggleRecipeFavorite(req.params.id, req.user.id);
    res.json(result);
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
};

// פונקציה לקבלת הצעות חיפוש
export const getSearchSuggestions = async (req, res, next) => {
  try {
    const suggestions = await fetchSearchSuggestions(req.query.keyword);
    res.json(suggestions);
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
};

// פונקציה לקבלת מתכונים פופולריים
export const getPopularRecipes = async (req, res) => {
  try {
    console.log('Fetching popular recipes...');
    
    // שליפת מתכונים פופולריים ממסד הנתונים
    const recipes = await fetchPopularRecipes();
    
    if (!recipes || recipes.length === 0) {
      console.warn('No popular recipes found.');
      return res.status(404).json({ message: 'No popular recipes found' });
    }

    console.log('Fetched popular recipes:', recipes);
    res.status(200).json(recipes);
  } catch (error) {
    console.error('Error fetching popular recipes:', error.message);
    res.status(500).json({ message: 'Failed to fetch popular recipes' });
  }
};
