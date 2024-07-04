const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  allergens: [{ type: String }],
  substitutes: [{
    ingredient: { type: String },
    alternatives: [{ type: String }]
  }],
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: { type: Number, min: 1, max: 5 }
  }],
  averageRating: { type: Number, default: 0 }
});

RecipeSchema.methods.updateAverageRating = function() {
  const totalScore = this.ratings.reduce((sum, rating) => sum + rating.score, 0);
  this.averageRating = this.ratings.length > 0 ? totalScore / this.ratings.length : 0;
};

module.exports = mongoose.model('Recipe', RecipeSchema);