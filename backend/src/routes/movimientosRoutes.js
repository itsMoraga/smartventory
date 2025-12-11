const express = require('express');
const router = express.Router();
const MovimientoController = require('../controllers/MovimientoController');

// Listar movimientos de un producto
router.get('/producto/:id_producto', MovimientoController.listarPorProducto);

// Registrar un movimiento
router.post('/', MovimientoController.crear);

module.exports = router;
