import mongoose from 'mongoose';

const AllergenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'שם האלרגן באנגלית הוא שדה חובה'],
    unique: true,
    trim: true,
    maxlength: [50, 'שם האלרגן לא יכול להיות ארוך מ-50 תווים']
  },
  hebrewName: {
    type: String,
    required: [true, 'שם האלרגן בעברית הוא שדה חובה'],
    unique: true,
    trim: true,
    maxlength: [50, 'שם האלרגן בעברית לא יכול להיות ארוך מ-50 תווים']
  },
  icon: {
    type: String,
    required: [true, 'אייקון האלרגן הוא שדה חובה']
  },
  description: {
    type: String,
    required: [true, 'תיאור האלרגן הוא שדה חובה'],
    maxlength: [500, 'תיאור האלרגן לא יכול להיות ארוך מ-500 תווים']
  },
  symptoms: {
    type: [String],
    required: [true, 'יש לציין לפחות תסמין אחד'],
    validate: [arrayLimit, 'מספר התסמינים לא יכול לעלות על 10']
  },
  avoidList: {
    type: [String],
    required: [true, 'יש לציין לפחות מאכל אחד להימנעות'],
    validate: [arrayLimit, 'מספר המאכלים להימנעות לא יכול לעלות על 20']
  },
  alternatives: {
    type: [String],
    validate: [arrayLimit, 'מספר החלופות לא יכול לעלות על 10']
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

function arrayLimit(val) {
  return val.length <= 20;
}

AllergenSchema.index({ name: 'text', hebrewName: 'text', description: 'text' });

export default mongoose.model('Allergen', AllergenSchema);