import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'שם משתמש הוא שדה חובה'],
    unique: true,
    trim: true,
    minlength: [3, 'שם משתמש חייב להכיל לפחות 3 תווים'],
    maxlength: [30, 'שם משתמש יכול להכיל עד 30 תווים']
  },
  email: {
    type: String,
    required: [true, 'אימייל הוא שדה חובה'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'נא להזין כתובת אימייל תקינה']
  },
  password: {
    type: String,
    required: [true, 'סיסמה היא שדה חובה'],
    minlength: [6, 'הסיסמה חייבת להכיל לפחות 6 תווים']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// האש לסיסמה לפני שמירה
UserSchema.pre('save', async function(next) {
  // בדיקה אם הסיסמה שונתה
  if (!this.isModified('password')) return next();
  
  try {
    // יצירת האש לסיסמה
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// מתודה להשוואת סיסמאות
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model('User', UserSchema);

export default User;