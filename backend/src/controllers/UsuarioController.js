
const bcrypt = require('bcrypt');
const { Usuario } = require('../models');

const UsuarioController = {
  registrar: async (req, res) => {
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
        mensaje: 'Usuario registrado correctamente',
        usuario: { id_usuario: nuevo.id_usuario, nombre: nuevo.nombre, correo: nuevo.correo }
      });
    } catch (error) {
      console.error('Error registrar usuario:', error);
      return res.status(500).json({ mensaje: 'Error al registrar usuario', error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { correo, contrasena } = req.body;

      if (!correo || !contrasena) {
        return res.status(400).json({ mensaje: 'Faltan correo y contraseña' });
      }

      // Buscar usuario
      const usuario = await Usuario.findOne({ where: { correo } });
      if (!usuario) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas' });
      }

      // Verificar contraseña
      const match = await bcrypt.compare(contrasena, usuario.contrasena);
      if (!match) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas' });
      }

      // Aquí podrías generar un token JWT si usas authMiddleware
      // const token = jwt.sign({ id: usuario.id_usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({
        mensaje: 'Login exitoso',
        usuario: { id_usuario: usuario.id_usuario, nombre: usuario.nombre, correo: usuario.correo }
        // token: token 
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
    }
  },

  listar: async (req, res) => {
    try {
      const usuarios = await Usuario.findAll({ attributes: ['id_usuario','nombre','correo'] });
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id, { attributes: ['id_usuario', 'nombre', 'correo'] });
      if (!usuario) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener usuario', error: error.message });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, correo, contrasena } = req.body;

      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }

      if (nombre) usuario.nombre = nombre;
      if (correo) usuario.correo = correo;
      if (contrasena) {
        const saltRounds = 10;
        usuario.contrasena = await bcrypt.hash(contrasena, saltRounds);
      }

      await usuario.save();

      res.json({
        mensaje: 'Usuario actualizado correctamente',
        usuario: { id_usuario: usuario.id_usuario, nombre: usuario.nombre, correo: usuario.correo }
      });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al actualizar usuario', error: error.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }

      await usuario.destroy();
      res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al eliminar usuario', error: error.message });
    }
  }
};

module.exports = UsuarioController;
