const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost/allergy_recipes', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/api/recipes', async (req, res) => {
  try {
    const { allergens } = req.query;
    let query = {};
    if (allergens) {
      query = { allergens: { $nin: allergens.split(',') } };
    }
    const recipes = await Recipe.find(query);
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/recipes', async (req, res) => {
  const recipe = new Recipe(req.body);
  try {
    const newRecipe = await recipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});