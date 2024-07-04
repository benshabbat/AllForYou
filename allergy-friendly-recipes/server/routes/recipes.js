const router = require('express').Router();
const Recipe = require('../models/recipe.model');

// Get all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Add a new recipe
router.post('/add', async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    await newRecipe.save();
    res.json('Recipe added!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Get a specific recipe
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    res.json(recipe);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Delete a recipe
router.delete('/:id', async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json('Recipe deleted.');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Update a recipe
router.post('/update/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    Object.assign(recipe, req.body);
    await recipe.save();
    res.json('Recipe updated!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Rate a recipe
router.post('/:id/rate', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    const { userId, score } = req.body;
    
    const ratingIndex = recipe.ratings.findIndex(r => r.user.toString() === userId);
    if (ratingIndex > -1) {
      recipe.ratings[ratingIndex].score = score;
    } else {
      recipe.ratings.push({ user: userId, score });
    }
    
    recipe.calculateAverageRating();
    await recipe.save();
    
    res.json({ averageRating: recipe.averageRating });
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Add a comment to a recipe
router.post('/:id/comment', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    const { userId, text } = req.body;
    
    recipe.comments.push({ user: userId, text });
    await recipe.save();
    
    res.json(recipe.comments);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;