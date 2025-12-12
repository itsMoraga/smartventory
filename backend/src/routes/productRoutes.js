const express = require('express');
const router = express.Router();
const productoControlador = require('../controllers/ProductoController');
const { requireRole, authenticateJWT } = require('../middleware/authMiddleware');

router.use(authenticateJWT);

// Rutas
router.get('/', productoControlador.listar);
router.get('/:id', productoControlador.obtenerPorId);

// Rutas protegidas por rol
router.post('/', requireRole(['admin','operador']), productoControlador.crear);
router.put('/:id', requireRole(['admin','operador']), productoControlador.actualizar);
router.delete('/:id', requireRole(['admin']), productoControlador.eliminar);

module.exports = router;

