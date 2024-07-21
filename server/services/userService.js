import User from '../models/User.js';

export const updateLastLogin = async (userId) => {
  await User.findByIdAndUpdate(userId, { lastLogin: Date.now() });
};