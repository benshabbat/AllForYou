import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'שם המתכון הוא שדה חובה'],
    trim: true
  },
  ingredients: {
    type: String,
    required: [true, 'רשימת המרכיבים היא שדה חובה']
  },
  instructions: {
    type: String,
    required: [true, 'הוראות ההכנה הן שדה חובה']
  },
  allergens: {
    type: [String],
    default: []
  },
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
      max: 5
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  }
});

// מתודה לחישוב דירוג ממוצע
RecipeSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = this.ratings.reduce((acc, item) => acc + item.rating, 0);
    this.averageRating = (sum / this.ratings.length).toFixed(1);
  }
  return this.averageRating;
};

// הוק לפני שמירה: חישוב הדירוג הממוצע
RecipeSchema.pre('save', function(next) {
  if (this.isModified('ratings')) {
    this.calculateAverageRating();
  }
  next();
});

const Recipe = mongoose.model('Recipe', RecipeSchema);

export default Recipe;