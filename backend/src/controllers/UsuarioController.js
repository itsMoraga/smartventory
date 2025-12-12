
const bcrypt = require('bcrypt');
const { Usuario, Empresa, sequelize } = require('../models');
const jwt = require('jsonwebtoken');

const UsuarioController = {
  registrar: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      // Datos de la empresa y del usuario administrador
      const { 
        nombre_empresa, zona_horaria, moneda, pais, // Bloque 1
        nombre, correo, contrasena // Bloque 2
      } = req.body;

      if (!nombre_empresa || !pais || !nombre || !correo || !contrasena) {
        return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
      }

      // Verificar si ya existe el correo (globalmente único por simplicidad)
      const existente = await Usuario.findOne({ where: { correo } });
      if (existente) {
        await t.rollback();
        return res.status(409).json({ mensaje: 'El correo ya está registrado' });
      }

      // 1. Crear Tenant (Empresa)
      const nuevaEmpresa = await Empresa.create({
        nombre: nombre_empresa,
        zona_horaria: zona_horaria || 'UTC',
        moneda: moneda || 'USD',
        pais
      }, { transaction: t });

      // 2. Hashear contraseña
      const saltRounds = 10;
      const hash = await bcrypt.hash(contrasena, saltRounds);

      // 3. Crear Usuario Admin vinculado a la Empresa
      const nuevoUsuario = await Usuario.create({
        nombre,
        correo,
        contrasena: hash,
        rol: 'admin', // El primer usuario es admin
        id_empresa: nuevaEmpresa.id_empresa
      }, { transaction: t });

      await t.commit();

      // 4. Auto-login (generar token)
      const token = jwt.sign({
        id_usuario: nuevoUsuario.id_usuario,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol,
        id_empresa: nuevaEmpresa.id_empresa
      }, process.env.JWT_SECRET || 'supersecreto', { expiresIn: '2h' });

      return res.status(201).json({
        mensaje: 'Registro exitoso',
        usuario: { 
          id_usuario: nuevoUsuario.id_usuario, 
          nombre: nuevoUsuario.nombre, 
          correo: nuevoUsuario.correo, 
          rol: nuevoUsuario.rol,
          id_empresa: nuevaEmpresa.id_empresa
        },
        empresa: nuevaEmpresa,
        token
      });

    } catch (error) {
      await t.rollback();
      console.error('Error registrar usuario/empresa:', error);
      return res.status(500).json({ mensaje: 'Error al registrar', error: error.message });
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

      // Generar token JWT con id_empresa
      const token = jwt.sign({
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        id_empresa: usuario.id_empresa
      }, process.env.JWT_SECRET || 'supersecreto', { expiresIn: '2h' });

      res.json({
        mensaje: 'Login exitoso',
        usuario: { 
          id_usuario: usuario.id_usuario, 
          nombre: usuario.nombre, 
          correo: usuario.correo, 
          rol: usuario.rol,
          id_empresa: usuario.id_empresa
        },
        token
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
    }
  },

  listar: async (req, res) => {
    try {
      const usuarios = await Usuario.findAll({ 
        where: { id_empresa: req.user.id_empresa },
        attributes: ['id_usuario','nombre','correo','rol'] 
      });
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findOne({ 
        where: { 
          id_usuario: id,
          id_empresa: req.user.id_empresa
        },
        attributes: ['id_usuario', 'nombre', 'correo', 'rol'] 
      });
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

      const usuario = await Usuario.findOne({
        where: { 
          id_usuario: id,
          id_empresa: req.user.id_empresa
        }
      });
      
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
      const usuario = await Usuario.findOne({
        where: { 
          id_usuario: id,
          id_empresa: req.user.id_empresa
        }
      });
      
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
