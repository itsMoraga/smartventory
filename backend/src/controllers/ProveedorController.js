const { Proveedor } = require('../models');

exports.listar = async (req, res) => {
  try {
    const proveedores = await Proveedor.findAll({
      where: { id_empresa: req.user.id_empresa }
    });
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar proveedores', error });
  }
};

exports.crear = async (req, res) => {
  try {
    const nuevoProveedor = await Proveedor.create({
      ...req.body,
      id_empresa: req.user.id_empresa
    });
    res.status(201).json(nuevoProveedor);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const mensajes = error.errors.map(e => e.message);
      return res.status(400).json({ mensaje: 'Error de validación', errores: mensajes });
    }
    res.status(500).json({ mensaje: 'Error al crear proveedor', error });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Proveedor.update(req.body, {
      where: { 
        id_proveedor: id,
        id_empresa: req.user.id_empresa
      }
    });
    if (updated) {
      const proveedorActualizado = await Proveedor.findByPk(id);
      res.json(proveedorActualizado);
    } else {
      res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const mensajes = error.errors.map(e => e.message);
      return res.status(400).json({ mensaje: 'Error de validación', errores: mensajes });
    }
    res.status(500).json({ mensaje: 'Error al actualizar proveedor', error });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Proveedor.destroy({
      where: { 
        id_proveedor: id,
        id_empresa: req.user.id_empresa
      }
    });
    if (deleted) {
      res.json({ mensaje: 'Proveedor eliminado' });
    } else {
      res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar proveedor', error });
  }
};
