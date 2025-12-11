const { Movimiento, Producto, Usuario } = require('../models');

const MovimientoController = {
  // Listar movimientos de un producto
  listarPorProducto: async (req, res) => {
    try {
      const movimientos = await Movimiento.findAll({
        where: { id_producto: req.params.id_producto },
        include: [
          { model: Usuario, attributes: ['id_usuario', 'nombre', 'correo'] },
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
      const { id_producto, tipo, cantidad, id_usuario, observaciones } = req.body;
      const movimiento = await Movimiento.create({
        id_producto,
        tipo,
        cantidad,
        id_usuario,
        observaciones
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
      res.status(500).json({ mensaje: 'Error al registrar movimiento', error });
    }
  }
};

module.exports = MovimientoController;
