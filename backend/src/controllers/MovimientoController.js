const { Movimiento, Producto, Usuario, Proveedor } = require('../models');

const MovimientoController = {
  // Listar todos los movimientos (con filtros opcionales)
  listarTodos: async (req, res) => {
    try {
      const movimientos = await Movimiento.findAll({
        where: { id_empresa: req.user.id_empresa },
        include: [
          { model: Producto, attributes: ['id_producto', 'nombre'] },
          { model: Usuario, attributes: ['id_usuario', 'nombre'] },
          { model: Proveedor, attributes: ['id_proveedor', 'nombre'] }
        ],
        order: [['fecha', 'DESC']]
      });
      res.json(movimientos);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener movimientos', error });
    }
  },

  // Listar movimientos de un producto
  listarPorProducto: async (req, res) => {
    try {
      const movimientos = await Movimiento.findAll({
        where: { 
          id_producto: req.params.id_producto,
          id_empresa: req.user.id_empresa
        },
        include: [
          { model: Usuario, attributes: ['id_usuario', 'nombre', 'correo'] },
          { model: Proveedor, attributes: ['id_proveedor', 'nombre'] }
        ],
        order: [['fecha', 'DESC']]
      });
      res.json(movimientos);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener movimientos', error });
    }
  },

  // Registrar un movimiento
  crear: async (req, res) => {
    try {
      
      // Validar que si es entrada, se puede tener proveedor (opcional o requerido según regla de negocio, aquí lo dejamos opcional pero permitido)
      
      const { id_producto, tipo, cantidad, id_usuario, observaciones, id_proveedor } = req.body;
      const movimiento = await Movimiento.create({
        id_producto,
        tipo,
        cantidad,
        id_usuario,
        observaciones,
        id_proveedor: (tipo === 'entrada' && id_proveedor) ? id_proveedor : null,
        id_empresa: req.user.id_empresa
      });

      // Actualizar stock del producto
      const producto = await Producto.findOne({
        where: { 
          id_producto,
          id_empresa: req.user.id_empresa
        }
      });
      
      if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
      }

      if (tipo === 'entrada') {
        producto.cantidad += parseInt(cantidad);
      } else if (tipo === 'salida') {
        if (producto.cantidad < cantidad) {
          return res.status(400).json({ mensaje: 'Stock insuficiente' });
        }
        producto.cantidad -= parseInt(cantidad);
      } else if (tipo === 'ajuste') {
        // Ajuste podría ser sumar o restar, aquí asumimos que 'cantidad' es el ajuste neto
        // O podríamos implementar lógica específica. Por simplicidad, asumimos que ajuste reemplaza o suma.
        // Vamos a asumir que ajuste SUMA (si es negativo resta)
        producto.cantidad += parseInt(cantidad);
      }

      await producto.save();

      res.status(201).json({ mensaje: 'Movimiento registrado', movimiento });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al registrar movimiento', error });
    }
  }
};

module.exports = MovimientoController;
