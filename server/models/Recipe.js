import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
  // Recipe name (required, indexed for better search performance)
  name: {
    type: String,
    required: [true, 'שם המתכון הוא שדה חובה'],
    trim: true,
    maxlength: [100, 'שם המתכון לא יכול לעלות על 100 תווים'],
    index: true
  },
  // Brief description of the recipe
  description: {
    type: String,
    required: [true, 'תיאור המתכון הוא שדה חובה'],
    trim: true,
    maxlength: [500, 'תיאור המתכון לא יכול לעלות על 500 תווים']
  },
  // List of ingredients with name, amount, and optional unit
  ingredients: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: String,
      required: true,
      trim: true
    },
    unit: {
      type: String,
      trim: true
    }
  }],
  // Step-by-step cooking instructions
  instructions: {
    type: [String],
    required: [true, 'הוראות ההכנה הן שדה חובה'],
    validate: [arr => arr.length > 0, 'יש להזין לפחות הוראת הכנה אחת']
  },
  // List of allergens present in the recipe
  allergens: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Allergen'
  }],
  // Alternative ingredients for specific allergens
  alternatives: [{
    allergen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Allergen',
      required: true
    },
    substitute: {
      type: String,
      required: true,
      trim: true
    }
  }],
  // User who created the recipe
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'יוצר המתכון הוא שדה חובה'],
    index: true
  },
  // User ratings for the recipe
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'הדירוג חייב להיות בין 1 ל-5']
    }
  }],
  // Average rating calculated from user ratings
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  // Difficulty level of the recipe
  difficulty: {
    type: String,
    enum: ['קל', 'בינוני', 'מאתגר'],
    required: [true, 'רמת הקושי היא שדה חובה'],
    index: true
  },
  // Recipe category
  category: {
    type: String,
    enum: ['מנה ראשונה', 'מנה עיקרית', 'קינוח', 'משקה', 'חטיף'],
    required: [true, 'קטגוריית המתכון היא שדה חובה'],
    index: true
  },
  // Preparation time in minutes
  preparationTime: {
    type: Number,
    required: [true, 'זמן ההכנה הוא שדה חובה'],
    min: [1, 'זמן ההכנה חייב להיות לפחות דקה אחת']
  },
  // Cooking time in minutes
  cookingTime: {
    type: Number,
    required: [true, 'זמן הבישול הוא שדה חובה'],
    min: [0, 'זמן הבישול לא יכול להיות שלילי']
  },
  // Number of servings the recipe yields
  servings: {
    type: Number,
    required: [true, 'מספר המנות הוא שדה חובה'],
    min: [1, 'מספר המנות חייב להיות לפחות 1']
  },
  // Nutritional information per serving
  nutritionInfo: {
    calories: {
      type: Number,
      min: 0
    },
    protein: {
      type: Number,
      min: 0
    },
    carbohydrates: {
      type: Number,
      min: 0
    },
    fat: {
      type: Number,
      min: 0
    }
  },
  // URL or path to the recipe image
  image: {
    type: String,
    default: ''
  },
  // Flag to indicate if the recipe is published or still a draft
  isPublished: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total cooking time (prep + cooking)
RecipeSchema.virtual('totalTime').get(function() {
  return this.preparationTime + this.cookingTime;
});

// Virtual for comments (assuming a Comment model exists)
RecipeSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'recipe'
});

// Indexes for improved query performance
RecipeSchema.index({ name: 'text', 'ingredients.name': 'text' });
RecipeSchema.index({ createdBy: 1, createdAt: -1 });
RecipeSchema.index({ allergens: 1 });
RecipeSchema.index({ averageRating: -1 });

const Recipe = mongoose.model('Recipe', RecipeSchema);

export default Recipe;