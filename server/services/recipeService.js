import Recipe from '../models/Recipe.js';
import User from '../models/User.js';
import { validateRecipe } from '../api/validators/recipeValidator.js';
import Fuse from 'fuse.js';

export class RecipeService {
  async getAllRecipes(filters) {
    const { keyword, category, difficulty, allergens, maxPrepTime, maxCalories, page = 1, limit = 10 } = filters;
    const query = {};

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (allergens) query.allergens = { $nin: allergens.split(',') };
    if (maxPrepTime) query.preparationTime = { $lte: parseInt(maxPrepTime) };
    if (maxCalories) query['nutritionInfo.calories'] = { $lte: parseInt(maxCalories) };

    let recipes = await Recipe.find(query).populate('allergens');

    if (keyword) {
      const fuse = new Fuse(recipes, {
        keys: ['name', 'ingredients.name', 'instructions'],
        includeScore: true,
        threshold: 0.4
      });
      recipes = fuse.search(keyword).map(result => result.item);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    return {
      recipes: recipes.slice(startIndex, endIndex),
      currentPage: parseInt(page),
      totalPages: Math.ceil(recipes.length / limit),
      totalRecipes: recipes.length
    };
  }

  async getRecipeById(id) {
    return Recipe.findById(id).populate('createdBy', 'username').populate('allergens');
  }

  async createRecipe(recipeData, user) {
    const { error } = validateRecipe(recipeData);
    if (error) throw new Error(error.details[0].message);

    const recipe = new Recipe({
      ...recipeData,
      createdBy: user._id
    });
    return recipe.save();
  }

  async updateRecipe(id, recipeData, user) {
    const { error } = validateRecipe(recipeData);
    if (error) throw new Error(error.details[0].message);

    const recipe = await Recipe.findById(id);
    if (!recipe) return null;

    if (recipe.createdBy.toString() !== user._id.toString()) {
      throw new Error('Not authorized to update this recipe');
    }

    Object.assign(recipe, recipeData);
    return recipe.save();
  }

  async deleteRecipe(id, user) {
    const recipe = await Recipe.findById(id);
    if (!recipe) return null;

    if (recipe.createdBy.toString() !== user._id.toString() && user.role !== 'admin') {
      throw new Error('Not authorized to delete this recipe');
    }

    return Recipe.findByIdAndDelete(id);
  }

  async rateRecipe(recipeId, userId, rating) {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) throw new Error('Recipe not found');

    const ratingIndex = recipe.ratings.findIndex(r => r.user.toString() === userId);
    if (ratingIndex !== -1) {
      recipe.ratings[ratingIndex].rating = rating;
    } else {
      recipe.ratings.push({ user: userId, rating });
    }

    recipe.averageRating = recipe.ratings.reduce((acc, curr) => acc + curr.rating, 0) / recipe.ratings.length;
    return recipe.save();
  }

  async toggleFavorite(recipeId, userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const isFavorite = user.favorites.includes(recipeId);
    if (isFavorite) {
      user.favorites = user.favorites.filter(id => id.toString() !== recipeId);
    } else {
      user.favorites.push(recipeId);
    }

    await user.save();
    return { isFavorite: !isFavorite };
  }

  async getSearchSuggestions(keyword) {
    const recipes = await Recipe.find({}, 'name');
    const fuse = new Fuse(recipes, {
      keys: ['name'],
      includeScore: true,
      threshold: 0.4
    });

    const results = fuse.search(keyword);
    return results.slice(0, 5).map(result => result.item.name);
  }
}