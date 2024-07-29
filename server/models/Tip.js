import mongoose from 'mongoose';

const TipSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'תוכן הטיפ הוא שדה חובה'],
    trim: true,
    maxlength: [500, 'תוכן הטיפ לא יכול לעלות על 500 תווים']
  },
  category: {
    type: String,
    required: [true, 'קטגוריית הטיפ היא שדה חובה'],
    enum: ['תזונה', 'בישול', 'אלרגיות', 'כללי'],
    default: 'כללי'
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

const Tip = mongoose.model('Tip', TipSchema);

export default Tip;