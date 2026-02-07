// src/controllers/categorieController.js
const pool = require('../db');

// GET /api/categorie
exports.getAllCategorie = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categorie ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Errore getAllCategorie:', err);
    res.status(500).json({ message: 'Errore server' });
  }
};

// GET /api/categorie/:id
exports.getCategoriaById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM categorie WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Categoria non trovata' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Errore getCategoriaById:', err);
    res.status(500).json({ message: 'Errore server' });
  }
};

// POST /api/categorie
exports.createCategoria = async (req, res) => {
  const { nome } = req.body;

  if (!nome || nome.trim() === '') {
    return res.status(400).json({ message: 'Il campo nome è obbligatorio' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO categorie (nome) VALUES ($1) RETURNING *',
      [nome.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Errore createCategoria:', err);
    res.status(500).json({ message: 'Errore server' });
  }
};

// PUT /api/categorie/:id
exports.updateCategoria = async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;

  if (!nome || nome.trim() === '') {
    return res.status(400).json({ message: 'Il campo nome è obbligatorio' });
  }

  try {
    const result = await pool.query(
      'UPDATE categorie SET nome = $1 WHERE id = $2 RETURNING *',
      [nome.trim(), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Categoria non trovata' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Errore updateCategoria:', err);
    res.status(500).json({ message: 'Errore server' });
  }
};

// DELETE /api/categorie/:id
exports.deleteCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM categorie WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Categoria non trovata' });
    }

    res.json({ message: 'Categoria eliminata' });
  } catch (err) {
    console.error('Errore deleteCategoria:', err);
    res.status(500).json({ message: 'Errore server' });
  }
};
