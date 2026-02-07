// src/controllers/prodottiController.js
const pool = require('../db');

// GET /api/prodotti
exports.getAllProdotti = async (req, res, next) => {
  try {
    const { categoria, prezzo_min, prezzo_max } = req.query;

    let query = `
      SELECT p.*, c.nome AS categoria_nome
      FROM prodotti p
      LEFT JOIN categorie c ON p.categoria_id = c.id
      WHERE 1=1
    `;
    const params = [];

    // Filtro categoria
    if (categoria) {
      params.push(categoria);
      query += ` AND p.categoria_id = $${params.length}`;
    }

    // Filtro prezzo minimo
    if (prezzo_min) {
      params.push(prezzo_min);
      query += ` AND p.prezzo >= $${params.length}`;
    }

    // Filtro prezzo massimo
    if (prezzo_max) {
      params.push(prezzo_max);
      query += ` AND p.prezzo <= $${params.length}`;
    }

    query += ` ORDER BY p.id`;

    const result = await pool.query(query, params);
    res.json(result.rows);

  } catch (err) {
    next(err); // Passa l'errore al middleware centralizzato
  }
};


// GET /api/prodotti/:id
exports.getProdottoById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT p.*, c.nome AS categoria_nome
       FROM prodotti p
       LEFT JOIN categorie c ON p.categoria_id = c.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Prodotto non trovato' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Errore getProdottoById:', err);
    res.status(500).json({ message: 'Errore server' });
  }
};

// POST /api/prodotti
exports.createProdotto = async (req, res) => {
  const {
    titolo,
    prezzo,
    quantita,
    categoria_id,
    immagine,
    descrizione,
  } = req.body;

  // Validazioni base
  if (!titolo || titolo.trim() === '') {
    return res.status(400).json({ message: 'Il campo titolo è obbligatorio' });
  }
  if (prezzo == null || isNaN(prezzo)) {
    return res.status(400).json({ message: 'Il campo prezzo deve essere numerico' });
  }
  if (quantita == null || isNaN(quantita)) {
    return res.status(400).json({ message: 'Il campo quantita deve essere numerico' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO prodotti
        (titolo, prezzo, quantita, categoria_id, immagine, descrizione)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        titolo.trim(),
        prezzo,
        quantita,
        categoria_id || null,
        immagine || null,
        descrizione || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Errore createProdotto:', err);
    res.status(500).json({ message: 'Errore server' });
  }
};

// PUT /api/prodotti/:id
exports.updateProdotto = async (req, res) => {
  const { id } = req.params;
  const {
    titolo,
    prezzo,
    quantita,
    categoria_id,
    immagine,
    descrizione,
  } = req.body;

  if (!titolo || titolo.trim() === '') {
    return res.status(400).json({ message: 'Il campo titolo è obbligatorio' });
  }
  if (prezzo == null || isNaN(prezzo)) {
    return res.status(400).json({ message: 'Il campo prezzo deve essere numerico' });
  }
  if (quantita == null || isNaN(quantita)) {
    return res.status(400).json({ message: 'Il campo quantita deve essere numerico' });
  }

  try {
    const result = await pool.query(
      `UPDATE prodotti
       SET titolo = $1,
           prezzo = $2,
           quantita = $3,
           categoria_id = $4,
           immagine = $5,
           descrizione = $6
       WHERE id = $7
       RETURNING *`,
      [
        titolo.trim(),
        prezzo,
        quantita,
        categoria_id || null,
        immagine || null,
        descrizione || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Prodotto non trovato' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Errore updateProdotto:', err);
    res.status(500).json({ message: 'Errore server' });
  }
};

// DELETE /api/prodotti/:id
exports.deleteProdotto = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM prodotti WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Prodotto non trovato' });
    }

    res.json({ message: 'Prodotto eliminato' });
  } catch (err) {
    console.error('Errore deleteProdotto:', err);
    res.status(500).json({ message: 'Errore server' });
  }
};
