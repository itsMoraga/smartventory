const { Producto, Movimiento, Categoria, Proveedor, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getDashboardStats = async (req, res) => {
  try {
    const id_empresa = req.user.id_empresa;

    // 1. Total de Productos
    const totalProductos = await Producto.count({ where: { id_empresa } });

    // 2. Valor Total del Inventario (precio_costo * cantidad)
    const inventarioData = await Producto.findOne({
      where: { id_empresa },
      attributes: [
        [sequelize.fn('SUM', sequelize.literal('precio_costo * cantidad')), 'total']
      ],
      raw: true
    });
    const valorInventario = inventarioData ? inventarioData.total : 0;

    // 3. Productos con Stock Bajo
    const stockBajo = await Producto.count({
      where: {
        id_empresa,
        cantidad: { [Op.lte]: sequelize.col('stock_minimo') }
      }
    });

    // 4. Movimientos Recientes (últimos 5)
    const movimientosRecientes = await Movimiento.findAll({
      where: { id_empresa },
      limit: 5,
      order: [['fecha', 'DESC']],
      include: [
        { model: Producto, attributes: ['nombre'] },
        { model: Proveedor, attributes: ['nombre'] } // Opcional, si quieres mostrar proveedor
      ]
    });

    // 5. Categorías con más productos (Top 5) - Opcional
    // Requiere agrupación, puede ser complejo con Sequelize puro, lo omitimos por ahora o hacemos simple count
    const totalCategorias = await Categoria.count({ where: { id_empresa } });

    res.json({
      kpis: {
        totalProductos,
        valorTotalInventario: valorInventario || 0,
        productosStockBajo: stockBajo,
        totalCategorias
      },
      movimientosRecientes
    });

  } catch (error) {
    console.error('Error en dashboard:', error);
    res.status(500).json({ mensaje: 'Error al obtener estadísticas', error: error.message });
  }
};
