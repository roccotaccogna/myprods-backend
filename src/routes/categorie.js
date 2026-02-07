const express = require('express');
const router = express.Router();
const categorieController = require('../controllers/categorieController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

// Lettura categorie: accessibile agli utenti loggati
router.get('/', auth, categorieController.getAllCategorie);
router.get('/:id', auth, categorieController.getCategoriaById);

// Modifiche solo admin
router.post('/', auth, requireRole('admin'), categorieController.createCategoria);
router.put('/:id', auth, requireRole('admin'), categorieController.updateCategoria);
router.delete('/:id', auth, requireRole('admin'), categorieController.deleteCategoria);

module.exports = router;