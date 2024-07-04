// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const Recipe = require('./models/Recipe');
// const dotenv = require('dotenv');
// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());
// dotenv.config();

// mongoose.connect(process.env.MONGO_SERVER, { useNewUrlParser: true, useUnifiedTopology: true });

// app.get('/api/recipes', async (req, res) => {
//   try {
//     const { allergens } = req.query;
//     let query = {};
//     if (allergens) {
//       query = { allergens: { $nin: allergens.split(',') } };
//     }
//     const recipes = await Recipe.find(query);
//     res.json(recipes);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// app.post('/api/recipes', async (req, res) => {
//   const recipe = new Recipe(req.body);
//   try {
//     const newRecipe = await recipe.save();
//     res.status(201).json(newRecipe);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// app.put('/api/recipes/:id', async (req, res) => {
//   try {
//     const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updatedRecipe) {
//       return res.status(404).json({ message: 'Recipe not found' });
//     }
//     res.json(updatedRecipe);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// app.delete('/api/recipes/:id', async (req, res) => {
//   try {
//     const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
//     if (!deletedRecipe) {
//       return res.status(404).json({ message: 'Recipe not found' });
//     }
//     res.json({ message: 'Recipe deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
// app.get('/api/recipes/search', async (req, res) => {
//   try {
//     const { ingredients } = req.query;
//     const ingredientList = ingredients.split(',');
//     const recipes = await Recipe.find({
//       ingredients: { $in: ingredientList }
//     });
//     res.json(recipes);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// app.post('/api/recipes/:id/rate', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { userId, score } = req.body;

//     const recipe = await Recipe.findById(id);
//     if (!recipe) {
//       return res.status(404).json({ message: 'Recipe not found' });
//     }

//     const existingRatingIndex = recipe.ratings.findIndex(rating => rating.user.toString() === userId);
//     if (existingRatingIndex > -1) {
//       recipe.ratings[existingRatingIndex].score = score;
//     } else {
//       recipe.ratings.push({ user: userId, score });
//     }

//     recipe.updateAverageRating();
//     await recipe.save();

//     res.json({ averageRating: recipe.averageRating });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });


// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });



const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const recipesRouter = require('./routes/recipes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/recipes', recipesRouter);

// חיבור למסד הנתונים (תצטרך להגדיר את ה-URI בקובץ .env)
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});