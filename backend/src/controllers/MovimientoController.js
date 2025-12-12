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
      
      // Actualizar stock del producto si es entrada/salida/ajuste
      const producto = await Producto.findByPk(id_producto);
      if (producto) {
        let nuevoStock = producto.cantidad;
        if (tipo === 'entrada') nuevoStock += cantidad;
        else if (tipo === 'salida') nuevoStock -= cantidad;
        else if (tipo === 'ajuste') nuevoStock = cantidad;
        await producto.update({ cantidad: nuevoStock });
      }
      res.status(201).json({ mensaje: 'Movimiento registrado', movimiento });
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const mensajes = error.errors.map(e => e.message);
        return res.status(400).json({ mensaje: 'Error de validación', errores: mensajes });
      }
      res.status(500).json({ mensaje: 'Error al registrar movimiento', error });
    }
  }
};

module.exports = MovimientoController;
