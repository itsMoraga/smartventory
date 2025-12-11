// Script para poblar la base de datos con 50 productos de prueba para scroll infinito
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

    const productos = [];
    for (let i = 1; i <= 50; i++) {
      productos.push({
        nombre: `Producto ${i} prueba scroll infinito`,
        descripcion: `Descripción del producto ${i} para pruebas de scroll infinito`,
        precio: (Math.random() * 100).toFixed(2),
        id_usuario: usuario.id_usuario,
        id_categoria: categoriasIds.length > 0 ? categoriasIds[Math.floor(Math.random() * categoriasIds.length)] : null
      });
    }

    await Producto.bulkCreate(productos);
    console.log('50 productos de prueba insertados correctamente.');
    process.exit(0);
  } catch (err) {
    console.error('Error al insertar productos de prueba:', err);
    process.exit(1);
  }
}

main();
