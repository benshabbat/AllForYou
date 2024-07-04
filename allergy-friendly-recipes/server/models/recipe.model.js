// const mongoose = require('mongoose');

// const RecipeSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   ingredients: [{ type: String, required: true }],
//   allergens: [{ type: String }],
//   substitutes: [{
//     ingredient: { type: String },
//     alternatives: [{ type: String }]
//   }],
//   ratings: [{
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     score: { type: Number, min: 1, max: 5 }
//   }],
//   averageRating: { type: Number, default: 0 }
// });

// RecipeSchema.methods.updateAverageRating = function() {
//   const totalScore = this.ratings.reduce((sum, rating) => sum + rating.score, 0);
//   this.averageRating = this.ratings.length > 0 ? totalScore / this.ratings.length : 0;
// };

// module.exports = mongoose.model('Recipe', RecipeSchema);

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const recipeSchema = new Schema(
  {
    name: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    instructions: { type: String, required: true },
    allergens: [{ type: String }],
    substitutions: [
      {
        ingredient: String,
        alternatives: [String],
      },
    ],
    addedBy: { type: String },
  },
  {
    timestamps: true,
    ratings: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        score: { type: Number, min: 1, max: 5 },
      },
    ],
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        text: String,
        date: { type: Date, default: Date.now },
      },
    ],
    averageRating: { type: Number, default: 0 },
  }
);

// מתודה לחישוב הדירוג הממוצע
recipeSchema.methods.calculateAverageRating = function () {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = this.ratings.reduce((total, rating) => total + rating.score, 0);
    this.averageRating = sum / this.ratings.length;
  }
  return this.averageRating;
};

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
