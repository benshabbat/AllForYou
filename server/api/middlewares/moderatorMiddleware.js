export const isModerator = (req, res, next) => {
    if (req.user && (req.user.role === 'moderator' || req.user.role === 'admin')) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Moderator rights required.' });
    }
  };