import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Recipe name is required'],
    trim: true,
    maxlength: [100, 'Recipe name cannot exceed 100 characters']
  },
  ingredients: {
    type: [String],
    required: [true, 'Ingredients list is required'],
    validate: [arr => arr.length > 0, 'At least one ingredient is required']
  },
  instructions: {
    type: String,
    required: [true, 'Cooking instructions are required'],
    minlength: [10, 'Instructions should be at least 10 characters long']
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
    required: [true, 'Recipe creator must be specified']
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
      required: [true, 'Rating must be between 1 and 5']
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
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  preparationTime: {
    type: Number,
    required: [true, 'Preparation time is required'],
    min: 1
  },
  cookingTime: {
    type: Number,
    required: [true, 'Cooking time is required'],
    min: 1
  },
  servings: {
    type: Number,
    required: [true, 'Number of servings is required'],
    min: 1
  },
  category: {
    type: String,
    required: [true, 'Recipe category is required'],
    enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Snack']
  },
  // Add the comments field to the schema
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add index for better query performance
RecipeSchema.index({ name: 'text', ingredients: 'text' });
RecipeSchema.index({ createdBy: 1, createdAt: -1 });
RecipeSchema.index({ allergens: 1 });
RecipeSchema.index({ category: 1 });
RecipeSchema.index({ difficulty: 1 });

// Virtual for total time
RecipeSchema.virtual('totalTime').get(function() {
  return this.preparationTime + this.cookingTime;
});

// Method to calculate average rating
RecipeSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = this.ratings.reduce((acc, item) => acc + item.rating, 0);
    this.averageRating = sum / this.ratings.length;
  }
  return this.averageRating;
};

// Pre-save hook to calculate average rating
RecipeSchema.pre('save', function(next) {
  if (this.isModified('ratings')) {
    this.calculateAverageRating();
  }
  next();
});

const Recipe = mongoose.model('Recipe', RecipeSchema);

export default Recipe;