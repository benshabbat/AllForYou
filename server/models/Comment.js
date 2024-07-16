import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'תוכן התגובה הוא שדה חובה'],
    trim: true,
    maxlength: [1000, 'התגובה לא יכולה לעלות על 1000 תווים']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'המשתמש הוא שדה חובה']
  },
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: [true, 'המתכון הוא שדה חובה']
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  }
}, {
  timestamps: true
});

// אינדקסים
CommentSchema.index({ recipe: 1, createdAt: -1 });
CommentSchema.index({ user: 1, createdAt: -1 });

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;