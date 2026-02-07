// src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const SALT_ROUNDS = 10;

exports.signup = async (req, res, next) => {
  try {
    const { email, password, ruolo } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e password sono obbligatorie' });
    }

    // Controlla se esiste già
    const existing = await pool.query(
      'SELECT id FROM utenti WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Email già registrata' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Ruolo: se non specificato, user
    const userRole = ruolo || 'user';

    const result = await pool.query(
      `INSERT INTO utenti (email, password_hash, ruolo)
       VALUES ($1, $2, $3)
       RETURNING id, email, ruolo, created_at`,
      [email, passwordHash, userRole]
    );

    const user = result.rows[0];

    // Genera token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        ruolo: user.ruolo,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    res.status(201).json({
      message: 'Registrazione completata',
      user,
      token,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e password sono obbligatorie' });
    }

    const result = await pool.query(
      'SELECT * FROM utenti WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }

    const user = result.rows[0];

    // Verifica password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }

    // Genera token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        ruolo: user.ruolo,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    // Non restituiamo password_hash
    const { password_hash, ...safeUser } = user;

    res.json({
      message: 'Login effettuato',
      user: safeUser,
      token,
    });
  } catch (err) {
    next(err);
  }
};
