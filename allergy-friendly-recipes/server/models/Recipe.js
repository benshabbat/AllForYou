const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  allergens: [{ type: String }]
});

module.exports = mongoose.model('Recipe', RecipeSchema);