const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
dotenv.config();

mongoose.connect(process.env.MONGO_SERVER, { useNewUrlParser: true, useUnifiedTopology: true });

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

app.put('/api/recipes/:id', async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/recipes/:id', async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});