// src/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Header mancante
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token mancante o non valido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded contiene es: { id, email, ruolo, iat, exp }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token non valido o scaduto' });
  }
};
