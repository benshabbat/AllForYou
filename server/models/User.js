import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },
  allergenPreferences: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Allergen'
  }],
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }],  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user'
  },
  favorites: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Recipe'
}],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Add index for better query performance
UserSchema.index({ email: 1, username: 1 });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);

export default User;