const express = require('express');
const router = express.Router();
const productoControlador = require('../controllers/ProductoController');
const { requireRole, authenticateJWT } = require('../middleware/authMiddleware');

// Rutas
router.get('/', productoControlador.listar);
router.post('/', productoControlador.crear);
router.get('/:id', productoControlador.obtenerPorId);
router.put('/:id', productoControlador.actualizar);
// Solo admin puede eliminar productos
router.post('/', authenticateJWT, requireRole(['admin','operador']), productoControlador.crear);
router.put('/:id', authenticateJWT, requireRole(['admin','operador']), productoControlador.actualizar);
router.delete('/:id', authenticateJWT, requireRole(['admin']), productoControlador.eliminar);

module.exports = router;

