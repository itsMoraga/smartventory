const { Producto, Categoria, Usuario, Movimiento } = require('../models');
const { Op, col } = require('sequelize');

exports.getDashboardStats = async (req, res) => {
  try {
    const whereEmpresa = { id_empresa: req.user.id_empresa };

    // 1. Contadores Totales
    const totalProductos = await Producto.count({ where: whereEmpresa });
    const totalCategorias = await Categoria.count({ where: whereEmpresa });
    const totalUsuarios = await Usuario.count({ where: whereEmpresa });

    // Calcular Valor Total del Inventario (Costo * Cantidad)
    const productos = await Producto.findAll({
      where: whereEmpresa,
      attributes: ['cantidad', 'precio_costo']
    });
    
    const valorTotalInventario = productos.reduce((total, prod) => {
      const costo = parseFloat(prod.precio_costo) || 0;
      return total + (costo * prod.cantidad);
    }, 0);

    // 2. Productos con Stock Bajo
    // Buscamos productos donde cantidad <= stock_minimo
    const productosStockBajo = await Producto.findAll({
      where: {
        ...whereEmpresa,
        cantidad: {
          [Op.lte]: col('stock_minimo')
        }
      },
      limit: 5, // Solo mostramos los 5 más críticos en el dashboard
      order: [['cantidad', 'ASC']]
    });

    // 3. Últimos Movimientos
    const ultimosMovimientos = await Movimiento.findAll({
      where: whereEmpresa,
      limit: 5,
      order: [['fecha', 'DESC']],
      include: [
        { model: Producto, attributes: ['nombre'] },
        { model: Usuario, attributes: ['nombre'] }
      ]
    });

    res.json({
      kpis: {
        totalProductos,
        totalCategorias,
        totalUsuarios,
        valorTotalInventario
      },
      stockBajo: productosStockBajo,
      ultimosMovimientos
    });
  } catch (error) {
    console.error('Error en dashboard:', error);
    res.status(500).json({ mensaje: 'Error al obtener estadísticas', error });
  }
};
