export const updateLastLogin = async (userId) => {
    await User.findByIdAndUpdate(userId, { lastLogin: Date.now() });
  };