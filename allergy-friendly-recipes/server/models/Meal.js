import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  substitutes: {
    type: [String],
    default: [],
  },
  allergies: {
    type: [String],
    default: [],
  },
});

const Meal = mongoose.model('Meal', mealSchema);

export default Meal;