import Recipe from '../models/Recipe.js';
import Allergen from '../models/Allergen.js';

export const recipeService = {
  /**
   * Calculate and update the average rating for a recipe
   * @param {string} recipeId - The ID of the recipe
   * @returns {number} The updated average rating
   */
  calculateAverageRating: async (recipeId) => {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      throw new Error('מתכון לא נמצא');
    }
    
    if (recipe.ratings.length === 0) {
      recipe.averageRating = 0;
    } else {
      const sum = recipe.ratings.reduce((acc, item) => acc + item.rating, 0);
      recipe.averageRating = parseFloat((sum / recipe.ratings.length).toFixed(1));
    }
    
    await recipe.save();
    return recipe.averageRating;
  },

  /**
   * Validate that all provided allergen IDs exist in the database
   * @param {string[]} allergenIds - Array of allergen IDs to validate
   * @returns {string[]} Array of valid allergen IDs
   */
  validateAllergens: async (allergenIds) => {
    const allergens = await Allergen.find({ _id: { $in: allergenIds } });
    if (allergens.length !== allergenIds.length) {
      throw new Error('אחד או יותר מהאלרגנים אינם תקפים');
    }
    return allergens.map(a => a._id);
  },

  /**
   * Create a new recipe
   * @param {Object} recipeData - The recipe data
   * @returns {Object} The created recipe
   */
  createRecipe: async (recipeData) => {
    if (recipeData.allergens) {
      recipeData.allergens = await recipeService.validateAllergens(recipeData.allergens);
    }
    
    const recipe = new Recipe(recipeData);
    await recipe.save();
    return recipe;
  },

  /**
   * Update an existing recipe
   * @param {string} recipeId - The ID of the recipe to update
   * @param {Object} updateData - The data to update
   * @returns {Object} The updated recipe
   */
  updateRecipe: async (recipeId, updateData) => {
    if (updateData.allergens) {
      updateData.allergens = await recipeService.validateAllergens(updateData.allergens);
    }
    
    const recipe = await Recipe.findByIdAndUpdate(recipeId, updateData, { new: true, runValidators: true });
    if (!recipe) {
      throw new Error('מתכון לא נמצא');
    }
    return recipe;
  },

  /**
   * Add a new rating to a recipe
   * @param {string} recipeId - The ID of the recipe
   * @param {string} userId - The ID of the user adding the rating
   * @param {number} rating - The rating value
   * @returns {number} The updated average rating
   */
  addRating: async (recipeId, userId, rating) => {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      throw new Error('מתכון לא נמצא');
    }

    const ratingIndex = recipe.ratings.findIndex(r => r.user.toString() === userId.toString());
    if (ratingIndex !== -1) {
      recipe.ratings[ratingIndex].rating = rating;
    } else {
      recipe.ratings.push({ user: userId, rating });
    }

    await recipe.save();
    return recipeService.calculateAverageRating(recipeId);
  }
};

export default recipeService;