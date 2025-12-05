const { Producto } = require('../models');

const productoControlador = {
  listar: async (req, res) => {
    try {
      const productos = await Producto.findAll();
      res.json(productos);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener productos', error });
    }
  },

  crear: async (req, res) => {
    try {
      const nuevoProducto = await Producto.create(req.body);
      res.status(201).json({ mensaje: 'Producto creado correctamente', id: nuevoProducto.id_producto });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al crear producto', error });
    }
  },

  // Opcional: obtener producto por ID
  obtenerPorId: async (req, res) => {
    try {
      const producto = await Producto.findByPk(req.params.id);
      if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
      res.json(producto);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener producto', error });
    }
  },

  // Opcional: actualizar producto
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const [actualizado] = await Producto.update(req.body, { where: { id_producto: id } });
      if (!actualizado) return res.status(404).json({ mensaje: 'Producto no encontrado' });
      res.json({ mensaje: 'Producto actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al actualizar producto', error });
    }
  },

  // Opcional: eliminar producto
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const eliminado = await Producto.destroy({ where: { id_producto: id } });
      if (!eliminado) return res.status(404).json({ mensaje: 'Producto no encontrado' });
      res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al eliminar producto', error });
    }
  }
};

module.exports = productoControlador;
