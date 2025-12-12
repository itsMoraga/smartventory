const { Producto, FotoProducto, Proveedor } = require('../models');

const productoControlador = {
  listar: async (req, res) => {
    try {
      const productos = await Producto.findAll({
        where: { id_empresa: req.user.id_empresa },
        include: [
          {
            model: FotoProducto,
            attributes: ['url'],
            required: false,
            limit: 1
          },
          {
            model: Proveedor,
            attributes: ['nombre'],
            required: false
          }
        ]
      });
      // Para compatibilidad, si hay varias fotos, solo se envía la primera
      const productosConFoto = productos.map(p => {
        const prod = p.toJSON();
        let url = prod.FotoProductos?.[0]?.url || null;
        // Si la url comienza con '/uploads/', quitar ese prefijo
        if (url && url.startsWith('/uploads/')) {
          url = url.replace('/uploads/', '');
        }
        prod.foto = url;
        delete prod.FotoProductos;
        return prod;
      });
      res.json(productosConFoto);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener productos', error });
    }
  },

  crear: async (req, res) => {
    try {
      const nuevoProducto = await Producto.create({
        ...req.body,
        id_empresa: req.user.id_empresa
      });
      res.status(201).json({ mensaje: 'Producto creado correctamente', id: nuevoProducto.id_producto });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al crear producto', error });
    }
  },

  // Opcional: obtener producto por ID
  obtenerPorId: async (req, res) => {
    try {
      const producto = await Producto.findOne({
        where: { 
          id_producto: req.params.id,
          id_empresa: req.user.id_empresa
        },
        include: [
          { model: FotoProducto, attributes: ['url'] },
          { model: Proveedor, attributes: ['nombre'] }
        ]
      });
      if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
      res.json(producto);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener producto', error });
    }
  },

  actualizar: async (req, res) => {
    try {
      const [updated] = await Producto.update(req.body, {
        where: { 
          id_producto: req.params.id,
          id_empresa: req.user.id_empresa
        }
      });
      if (updated) {
        const actualizado = await Producto.findOne({
          where: { id_producto: req.params.id, id_empresa: req.user.id_empresa }
        });
        res.json(actualizado);
      } else {
        res.status(404).json({ mensaje: 'Producto no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al actualizar producto', error });
    }
  },

  eliminar: async (req, res) => {
    try {
      const deleted = await Producto.destroy({
        where: { 
          id_producto: req.params.id,
          id_empresa: req.user.id_empresa
        }
      });
      if (deleted) {
        res.json({ mensaje: 'Producto eliminado' });
      } else {
        res.status(404).json({ mensaje: 'Producto no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al eliminar producto', error });
    }
  }
};

module.exports = productoControlador;
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
