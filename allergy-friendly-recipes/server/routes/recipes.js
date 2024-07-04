const router = require('express').Router();
let Recipe = require('../models/recipe.model');

router.route('/').get((req, res) => {
  Recipe.find()
    .then(recipes => res.json(recipes))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const newRecipe = new Recipe(req.body);

  newRecipe.save()
    .then(() => res.json('Recipe added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Recipe.findById(req.params.id)
    .then(recipe => res.json(recipe))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Recipe.findByIdAndDelete(req.params.id)
    .then(() => res.json('Recipe deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Recipe.findById(req.params.id)
    .then(recipe => {
      recipe.name = req.body.name;
      recipe.ingredients = req.body.ingredients;
      recipe.instructions = req.body.instructions;
      recipe.allergens = req.body.allergens;
      recipe.substitutions = req.body.substitutions;

      recipe.save()
        .then(() => res.json('Recipe updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});
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
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

router.post('/:id/comment', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    const { userId, text } = req.body;
    
    recipe.comments.push({ user: userId, text });
    await recipe.save();
    
    res.json(recipe.comments);
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

module.exports = router;