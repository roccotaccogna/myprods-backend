const express = require('express');
const router = express.Router();
const prodottiController = require('../controllers/prodottiController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

// Tutti i prodotti: visibile agli utenti loggati (se vuoi anche pubblica, togli auth)
router.get('/', auth, prodottiController.getAllProdotti);
router.get('/:id', auth, prodottiController.getProdottoById);

// Solo admin possono modificare
router.post('/', auth, requireRole('admin'), prodottiController.createProdotto);
router.put('/:id', auth, requireRole('admin'), prodottiController.updateProdotto);
router.delete('/:id', auth, requireRole('admin'), prodottiController.deleteProdotto);

module.exports = router;