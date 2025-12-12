const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/ProveedorController');
const { authenticateJWT, requireRole } = require('../middleware/authMiddleware');

// Rutas protegidas
router.get('/', authenticateJWT, proveedorController.listar);
router.post('/', authenticateJWT, requireRole(['admin', 'operador']), proveedorController.crear);
router.put('/:id', authenticateJWT, requireRole(['admin', 'operador']), proveedorController.actualizar);
router.delete('/:id', authenticateJWT, requireRole(['admin']), proveedorController.eliminar);

module.exports = router;
