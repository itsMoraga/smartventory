const express = require('express');
const router = express.Router();
const MovimientoController = require('../controllers/MovimientoController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// Listar todos los movimientos
router.get('/', authenticateJWT, MovimientoController.listarTodos);

// Listar movimientos de un producto
router.get('/producto/:id_producto', authenticateJWT, MovimientoController.listarPorProducto);

// Registrar un movimiento
router.post('/', authenticateJWT, MovimientoController.crear);

module.exports = router;
