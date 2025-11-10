// Importar dependencias principales
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');
const productRoutes = require('./routes/productRoutes');



// Inicializar la app
const app = express();


// Configurar variables de entorno
dotenv.config();


// Middlewares
app.use(cors()); // Permite peticiones del frontend
app.use(express.json()); // Permite recibir datos JSON en las peticiones

//rutas 
app.use('/api/products', productRoutes);

// Puerto desde .env o 4000 por defecto
const PORT = process.env.PORT || 4000;

// Ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.send('🚀 Servidor Smartventory funcionando correctamente');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
