const axios = require('axios');
const jwt = require('jsonwebtoken');
const { Producto, Proveedor, Usuario } = require('./src/models');
require('dotenv').config();

async function testCreateMovimiento() {
  try {
    const producto = await Producto.findOne();
    const proveedor = await Proveedor.findOne();
    const usuario = await Usuario.findOne();
    if (!producto) return console.log('No hay productos en la DB.');
    if (!proveedor) return console.log('No hay proveedores en la DB.');
    if (!usuario) return console.log('No hay usuarios en la DB.');

    const token = jwt.sign({ id: usuario.id_usuario, rol: usuario.rol }, process.env.JWT_SECRET || 'supersecreto', { expiresIn: '1h' });

    const payload = {
      id_producto: producto.id_producto,
      tipo: 'entrada',
      cantidad: 5,
      id_usuario: usuario.id_usuario,
      observaciones: 'Prueba de movimiento con proveedor',
      id_proveedor: proveedor.id_proveedor
    };

    console.log('Enviando payload:', payload);
    const res = await axios.post('http://localhost:4000/api/movimientos', payload, { headers: { Authorization: `Bearer ${token}` } });
    console.log('Respuesta:', res.data);

    // Fetch last movimiento for product
    const movimientos = await axios.get(`http://localhost:4000/api/movimientos/producto/${producto.id_producto}`, { headers: { Authorization: `Bearer ${token}` } });
    console.log('Movimientos recientes:', movimientos.data.slice(0,3));
  } catch (err) {
    if (err.response) console.log('Error status:', err.response.status, err.response.data);
    else console.log('Error:', err.message);
  }
}

testCreateMovimiento();