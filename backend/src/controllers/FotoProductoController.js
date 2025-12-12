const { FotoProducto, Producto } = require('../models');
const fs = require('fs');
const path = require('path');

const FotoProductoController = {
  subirFoto: async (req, res) => {
    try {
      // req.body.id_producto viene del form-data
      const { id_producto } = req.body;
      
      if (!req.file) {
        return res.status(400).json({ mensaje: 'No se ha subido ninguna imagen' });
      }

      if (!id_producto) {
        // Si falla, borrar la imagen subida para no dejar basura
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ mensaje: 'El id_producto es obligatorio' });
      }

      // Verificar que el producto existe y pertenece a la empresa
      const producto = await Producto.findOne({
        where: { 
          id_producto,
          id_empresa: req.user.id_empresa
        }
      });
      if (!producto) {
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
      }

      // Guardar ruta relativa para servirla estáticamente.
      // req.file.filename es el nombre del archivo guardado.
      // La URL será accesible como http://localhost:4000/uploads/nombrearchivo.jpg
      const urlImagen = `/uploads/${req.file.filename}`;

      const nuevaFoto = await FotoProducto.create({
        url: urlImagen,
        id_producto
      });

      res.status(201).json({
        mensaje: 'Foto subida correctamente',
        foto: nuevaFoto
      });

    } catch (error) {
      console.error('Error al subir foto:', error);
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path); // Limpiar si hay error
      }
      res.status(500).json({ mensaje: 'Error al subir la foto', error: error.message });
    }
  },

  listarPorProducto: async (req, res) => {
    try {
      const { id_producto } = req.params;
      
      // Verificar que el producto pertenece a la empresa
      const producto = await Producto.findOne({
        where: { 
          id_producto,
          id_empresa: req.user.id_empresa
        }
      });

      if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
      }

      const fotos = await FotoProducto.findAll({ where: { id_producto } });
      res.json(fotos);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener fotos', error: error.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Buscar la foto e incluir el producto para verificar la empresa
      const foto = await FotoProducto.findOne({
        where: { id_foto: id },
        include: {
          model: Producto,
          where: { id_empresa: req.user.id_empresa }
        }
      });

      if (!foto) {
        return res.status(404).json({ mensaje: 'Foto no encontrada' });
      }

      // Eliminar archivo físico
      // La url guardada es algo como "/uploads/nombrearchivo.jpg"
      const nombreArchivo = foto.url.split('/').pop();
      const rutaArchivo = path.join(__dirname, '../uploads', nombreArchivo);

      if (fs.existsSync(rutaArchivo)) {
        fs.unlinkSync(rutaArchivo);
      }

      await foto.destroy();
      res.json({ mensaje: 'Foto eliminada correctamente' });

    } catch (error) {
      console.error('Error al eliminar foto:', error);
      res.status(500).json({ mensaje: 'Error al eliminar foto', error: error.message });
    }
  }
};

module.exports = FotoProductoController;
