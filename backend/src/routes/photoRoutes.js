const express = require('express');
const router = express.Router();
const FotoProductoController = require('../controllers/FotoProductoController');
const upload = require('../middleware/uploadMiddleware');

// Subir foto (campo 'imagen' en el form-data)
router.post('/', upload.single('imagen'), FotoProductoController.subirFoto);

// Listar fotos de un producto
router.get('/producto/:id_producto', FotoProductoController.listarPorProducto);

// Eliminar foto
router.delete('/:id', FotoProductoController.eliminar);

module.exports = router;
