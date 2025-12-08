const { Categoria } = require('../models');

const CategoriaController = {
  crear: async (req, res) => {
    try {
      const { nombre } = req.body;

      if (!nombre) {
        return res.status(400).json({ mensaje: 'El nombre de la categoría es obligatorio' });
      }

      const nuevaCategoria = await Categoria.create({ nombre });

      return res.status(201).json({
        mensaje: 'Categoría creada correctamente',
        categoria: nuevaCategoria
      });
    } catch (error) {
      console.error('Error al crear categoría:', error);
      return res.status(500).json({ mensaje: 'Error al crear categoría', error: error.message });
    }
  },

  listar: async (req, res) => {
    try {
      const categorias = await Categoria.findAll();
      res.json(categorias);
    } catch (error) {
      console.error('Error al listar categorías:', error);
      res.status(500).json({ mensaje: 'Error al obtener categorías', error: error.message });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const categoria = await Categoria.findByPk(id);

      if (!categoria) {
        return res.status(404).json({ mensaje: 'Categoría no encontrada' });
      }

      res.json(categoria);
    } catch (error) {
      console.error('Error al obtener categoría:', error);
      res.status(500).json({ mensaje: 'Error al obtener categoría', error: error.message });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre } = req.body;

      const categoria = await Categoria.findByPk(id);

      if (!categoria) {
        return res.status(404).json({ mensaje: 'Categoría no encontrada' });
      }

      if (nombre) {
        categoria.nombre = nombre;
      }

      await categoria.save();

      res.json({
        mensaje: 'Categoría actualizada correctamente',
        categoria
      });
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      res.status(500).json({ mensaje: 'Error al actualizar categoría', error: error.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const categoria = await Categoria.findByPk(id);

      if (!categoria) {
        return res.status(404).json({ mensaje: 'Categoría no encontrada' });
      }

      await categoria.destroy();
      res.json({ mensaje: 'Categoría eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      res.status(500).json({ mensaje: 'Error al eliminar categoría', error: error.message });
    }
  }
};

module.exports = CategoriaController;
