const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/UsuarioController');
const { requireRole, authenticateJWT } = require('../middleware/authMiddleware');

// Rutas públicas
router.post('/register', usuarioController.registrar);
router.post('/login', usuarioController.login);

// Rutas protegidas (o públicas si estás probando sin token aún)
router.get('/', usuarioController.listar);
router.get('/:id', usuarioController.obtenerPorId); // Esta es la que te daba error 404
router.put('/:id', usuarioController.actualizar);
// Solo admin puede eliminar usuarios
router.put('/:id', authenticateJWT, requireRole(['admin']), usuarioController.actualizar);
router.delete('/:id', authenticateJWT, requireRole(['admin']), usuarioController.eliminar);

module.exports = router;
