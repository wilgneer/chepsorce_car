// routes/clienteRoutes.js
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.get('/clientes', clienteController.buscarClientes);

module.exports = router;
