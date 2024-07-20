import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'שם המתכון הוא שדה חובה'],
    trim: true,
    maxlength: [100, 'שם המתכון לא יכול לעלות על 100 תווים']
  },
  description: {
    type: String,
    required: [true, 'תיאור המתכון הוא שדה חובה'],
    trim: true,
    maxlength: [500, 'תיאור המתכון לא יכול לעלות על 500 תווים']
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
  alternatives: [{
    allergen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Allergen',
      required: true
    },
    substitute: {
      type: String,
      required: true
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'יוצר המתכון הוא שדה חובה']
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
      required: [true, 'הדירוג חייב להיות בין 1 ל-5']
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  difficulty: {
    type: String,
    enum: ["קל", "בינוני", "מאתגר"],
    required: [true, 'רמת הקושי היא שדה חובה']
  },
  category: {
    type: String,
    enum: ["מנה ראשונה", "מנה עיקרית", "קינוח", "משקה", "חטיף"],
    required: [true, 'קטגוריית המתכון היא שדה חובה']
  },
  preparationTime: {
    type: Number,
    required: [true, 'זמן ההכנה הוא שדה חובה'],
    min: [1, 'זמן ההכנה חייב להיות לפחות דקה אחת']
  },
  cookingTime: {
    type: Number,
    required: [true, 'זמן הבישול הוא שדה חובה'],
    min: [0, 'זמן הבישול לא יכול להיות שלילי']
  },
  servings: {
    type: Number,
    required: [true, 'מספר המנות הוא שדה חובה'],
    min: [1, 'מספר המנות חייב להיות לפחות 1']
  },
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
  image: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// וירטואל לזמן כולל
RecipeSchema.virtual('totalTime').get(function() {
  return this.preparationTime + this.cookingTime;
});

// וירטואל לתגובות
RecipeSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'recipe'
});

// מתודה לחישוב דירוג ממוצע
RecipeSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = this.ratings.reduce((acc, item) => acc + item.rating, 0);
    this.averageRating = parseFloat((sum / this.ratings.length).toFixed(1));
  }
  return this.averageRating;
};

// הוק pre-save לחישוב דירוג ממוצע
RecipeSchema.pre('save', function(next) {
  if (this.isModified('ratings')) {
    this.calculateAverageRating();
  }
  next();
});

// אינדקסים
RecipeSchema.index({ name: 'text', ingredients: 'text' });
RecipeSchema.index({ createdBy: 1, createdAt: -1 });
RecipeSchema.index({ allergens: 1 });
RecipeSchema.index({ category: 1 });
RecipeSchema.index({ difficulty: 1 });

const Recipe = mongoose.model('Recipe', RecipeSchema);

export default Recipe;