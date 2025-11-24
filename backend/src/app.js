const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models'); // modelos con Sequelize
const productRoutes = require('./routes/productRoutes');

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/products', productRoutes);

// Ruta de prueba
app.get('/', (req, res) => res.send('🚀 Servidor Smartventory funcionando correctamente'));

// Verificar conexión a la base de datos
sequelize.authenticate()
  .then(() => console.log('✅ Conexión a MySQL con Sequelize exitosa.'))
  .catch(err => console.error('❌ Error al conectar a MySQL:', err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));
