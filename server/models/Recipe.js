import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'שם המתכון הוא שדה חובה'],
    trim: true,
    maxlength: [100, 'שם המתכון לא יכול לעלות על 100 תווים']
  },
  ingredients: {
    type: [String],
    required: [true, 'רשימת המרכיבים היא שדה חובה'],
    validate: [arr => arr.length > 0, 'יש להזין לפחות מרכיב אחד']
  },
  instructions: {
    type: String,
    required: [true, 'הוראות ההכנה הן שדה חובה'],
    minlength: [10, 'הוראות ההכנה חייבות להכיל לפחות 10 תווים']
  },
  allergens: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Allergen'
  }],
  alternatives: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'יש לציין את יוצר המתכון']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'יש לספק דירוג בין 1 ל-5']
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add index for better query performance
RecipeSchema.index({ name: 'text' });
RecipeSchema.index({ createdBy: 1, createdAt: -1 });
RecipeSchema.index({ allergens: 1 });

const Recipe = mongoose.model('Recipe', RecipeSchema);

export default Recipe;