// Script para crear dos productos de prueba con diferentes estados de stock
const { sequelize, Producto } = require('./src/models');

async function main() {
  try {
    // Buscar un usuario existente para asignar a los productos
    const [usuario] = await sequelize.query('SELECT id_usuario FROM usuarios LIMIT 1', { type: sequelize.QueryTypes.SELECT });
    if (!usuario) {
      throw new Error('No hay usuarios en la base de datos. Crea al menos uno antes de ejecutar este script.');
    }

    // Buscar categorías existentes (opcional)
    const categorias = await sequelize.query('SELECT id_categoria FROM categorias', { type: sequelize.QueryTypes.SELECT });
    const categoriasIds = categorias.map(c => c.id_categoria);

    const productos = [
      {
        nombre: 'Producto Stock Bajo',
        descripcion: 'Producto para probar alerta de stock bajo',
        precio: 10.99,
        cantidad: 2,
        stock_minimo: 5,
        id_usuario: usuario.id_usuario,
        id_categoria: categoriasIds.length > 0 ? categoriasIds[0] : null
      },
      {
        nombre: 'Producto Agotado',
        descripcion: 'Producto para probar alerta de agotado',
        precio: 15.99,
        cantidad: 0,
        stock_minimo: 3,
        id_usuario: usuario.id_usuario,
        id_categoria: categoriasIds.length > 0 ? categoriasIds[0] : null
      }
    ];

    await Producto.bulkCreate(productos);
    console.log('2 productos de prueba insertados correctamente.');
    process.exit(0);
  } catch (err) {
    console.error('Error al insertar productos de prueba:', err);
    process.exit(1);
  }
}

main();
