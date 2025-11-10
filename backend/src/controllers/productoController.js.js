const Producto = require('../modelos/Producto');

const productoControlador = {
  listar: (req, res) => {
    Producto.obtenerTodos((err, resultados) => {
      if (err) {
        res.status(500).json({ mensaje: 'Error al obtener productos', error: err });
      } else {
        res.json(resultados);
      }
    });
  },

  crear: (req, res) => {
    const nuevoProducto = req.body;
    Producto.crear(nuevoProducto, (err, resultado) => {
      if (err) {
        res.status(500).json({ mensaje: 'Error al crear producto', error: err });
      } else {
        res.status(201).json({ mensaje: 'Producto creado correctamente', id: resultado.insertId });
      }
    });
  }
};

module.exports = productoControlador;
