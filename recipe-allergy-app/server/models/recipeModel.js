import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  ingredients: [{
    name: String,
    amount: String
  }],
  instructions: [{
    type: String
  }],
  allergens: [{
    type: String
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  image: {
    type: String,
    default: '/images/default-recipe.jpg'
  }
}, {
  timestamps: true
});

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;