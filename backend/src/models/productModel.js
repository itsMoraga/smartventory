const bd = require('../config/bd');

// Modelo con funciones básicas
const Producto = {
  obtenerTodos: (callback) => {
    bd.query('SELECT * FROM productos', callback);
  },

  crear: (datos, callback) => {
    const { nombre, descripcion, precio, categoria } = datos;
    bd.query(
      'INSERT INTO productos (nombre, descripcion, precio, categoria) VALUES (?, ?, ?, ?)',
      [nombre, descripcion, precio, categoria],
      callback
    );
  }
};

module.exports = Producto;
