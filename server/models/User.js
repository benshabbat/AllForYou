import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// הגדרת סכמת המשתמש
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// האש לסיסמה לפני שמירה
// מופעל אוטומטית לפני שמירת מסמך חדש או עדכון סיסמה
UserSchema.pre('save', async function(next) {
  // בדיקה אם הסיסמה שונתה
  if (!this.isModified('password')) return next();
  
  // יצירת האש לסיסמה
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// מתודה להשוואת סיסמאות
// מאפשרת השוואה בין סיסמה מוצפנת לסיסמה שהוזנה
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);

export default User;