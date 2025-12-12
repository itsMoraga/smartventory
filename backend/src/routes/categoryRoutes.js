const express = require('express');
const router = express.Router();
const CategoriaController = require('../controllers/CategoriaController');
const { authenticateJWT, requireRole } = require('../middleware/authMiddleware');

router.use(authenticateJWT);

router.post('/', requireRole(['admin', 'operador']), CategoriaController.crear);
router.get('/', CategoriaController.listar);
router.get('/:id', CategoriaController.obtenerPorId);
router.put('/:id', requireRole(['admin', 'operador']), CategoriaController.actualizar);
router.delete('/:id', requireRole(['admin']), CategoriaController.eliminar);

module.exports = router;
