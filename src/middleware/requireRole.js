// src/middleware/requireRole.js
module.exports = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.ruolo !== role) {
      return res.status(403).json({ message: 'Accesso negato' });
    }
    next();
  };
};
