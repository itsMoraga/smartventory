
const bcrypt = require('bcrypt');
const { Usuario } = require('../models');

const UsuarioController = {
  crear: async (req, res) => {
    try {
      const { nombre, correo, contrasena } = req.body;

      if (!nombre || !correo || !contrasena) {
        return res.status(400).json({ mensaje: 'Faltan campos obligatorios (nombre, correo, contrasena)' });
      }

      // Verificar si ya existe el correo
      const existente = await Usuario.findOne({ where: { correo } });
      if (existente) {
        return res.status(409).json({ mensaje: 'El correo ya está registrado' });
      }

      // Hashear contraseña
      const saltRounds = 10;
      const hash = await bcrypt.hash(contrasena, saltRounds);

      const nuevo = await Usuario.create({
        nombre,
        correo,
        contrasena: hash
      });

      // Retornamos id y datos no sensibles
      return res.status(201).json({
        mensaje: 'Usuario creado correctamente',
        usuario: { id_usuario: nuevo.id_usuario, nombre: nuevo.nombre, correo: nuevo.correo }
      });
    } catch (error) {
      console.error('Error crear usuario:', error);
      return res.status(500).json({ mensaje: 'Error al crear usuario', error: error.message });
    }
  },

  listar: async (req, res) => {
    try {
      const usuarios = await Usuario.findAll({ attributes: ['id_usuario','nombre','correo'] });
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
    }
  }
};

module.exports = UsuarioController;
