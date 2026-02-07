// src/server.js
require('dotenv').config();
const express = require('express');
const app = express();
const pool = require('./db');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const prodottiRoutes = require('./routes/prodotti');
const categorieRoutes = require('./routes/categorie');

// Middleware per leggere JSON nel body
app.use(express.json());

// Autorizzazione CORS
app.use(cors({ 
  origin: [
    'http://localhost:5173', 
    'https://myprods-frontend.vercel.app'
  ],
  methods: 'GET,POST,PUT,DELETE', 
  allowedHeaders: 'Content-Type,Authorization' 
}));

// Route di test
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'ok', 
      message: 'MyProds API attiva',
      dbTime: result.rows[0].now,
    });
  } catch (error) {
    console.error('Error connessione DB: ', error);
    res.status(500).json({status: 'error', message: 'Errore connessione DB'});
  }

});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/prodotti', prodottiRoutes);
app.use('/api/categorie', categorieRoutes);

// Avvio server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});