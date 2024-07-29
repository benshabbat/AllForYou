import { RecipeService } from '../../services/recipeService.js';
import { ErrorHandler } from '../../utils/errorHandler.js';

export class RecipeController {
  constructor(recipeService) {
    this.recipeService = recipeService;
  }

  async getAllRecipes(req, res, next) {
    try {
      const recipes = await this.recipeService.getAllRecipes(req.query);
      res.json(recipes);
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  }

  async getRecipe(req, res, next) {
    try {
      const recipe = await this.recipeService.getRecipeById(req.params.id);
      if (!recipe) {
        return next(new ErrorHandler('Recipe not found', 404));
      }
      res.json(recipe);
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  }

  async createRecipe(req, res, next) {
    try {
      const recipe = await this.recipeService.createRecipe(req.body, req.user);
      res.status(201).json(recipe);
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  async updateRecipe(req, res, next) {
    try {
      const recipe = await this.recipeService.updateRecipe(req.params.id, req.body, req.user);
      if (!recipe) {
        return next(new ErrorHandler('Recipe not found', 404));
      }
      res.json(recipe);
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  async deleteRecipe(req, res, next) {
    try {
      const result = await this.recipeService.deleteRecipe(req.params.id, req.user);
      if (!result) {
        return next(new ErrorHandler('Recipe not found', 404));
      }
      res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  }

  async rateRecipe(req, res, next) {
    try {
      const { rating } = req.body;
      const recipe = await this.recipeService.rateRecipe(req.params.id, req.user.id, rating);
      res.json({ averageRating: recipe.averageRating });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  async toggleFavorite(req, res, next) {
    try {
      const result = await this.recipeService.toggleFavorite(req.params.id, req.user.id);
      res.json(result);
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  async getSearchSuggestions(req, res, next) {
    try {
      const suggestions = await this.recipeService.getSearchSuggestions(req.query.keyword);
      res.json(suggestions);
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  }
}

export const recipeController = new RecipeController(new RecipeService());