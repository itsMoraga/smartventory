const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/UsuarioController');
const { requireRole, authenticateJWT } = require('../middleware/authMiddleware');

// Rutas públicas
router.post('/register', usuarioController.registrar);
router.post('/login', usuarioController.login);

// Rutas protegidas
// Listar usuarios: Solo admin
router.get('/', authenticateJWT, requireRole(['admin']), usuarioController.listar);

// Obtener usuario por ID: Admin
router.get('/:id', authenticateJWT, requireRole(['admin']), usuarioController.obtenerPorId);

// Actualizar usuario: Solo admin
router.put('/:id', authenticateJWT, requireRole(['admin']), usuarioController.actualizar);

// Eliminar usuario: Solo admin
router.delete('/:id', authenticateJWT, requireRole(['admin']), usuarioController.eliminar);

module.exports = router;
