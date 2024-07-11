// models/Allergen.js
import mongoose from 'mongoose';

const AllergenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  icon: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  commonNames: {
    type: [String],
    default: []
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  }
}, { timestamps: true });

export default mongoose.model('Allergen', AllergenSchema);