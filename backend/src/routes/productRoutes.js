const express = require('express');
const router = express.Router();
const productoControlador = require('../controllers/ProductoController');

// Rutas
router.get('/', productoControlador.listar);
router.post('/', productoControlador.crear);
router.get('/:id', productoControlador.obtenerPorId);
router.put('/:id', productoControlador.actualizar);
router.delete('/:id', productoControlador.eliminar);

module.exports = router;
