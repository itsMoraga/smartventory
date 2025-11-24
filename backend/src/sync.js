require("dotenv").config();
const sequelize = require("./config/db"); // importar sequelize REAL
require("./models"); // carga los modelos (si tienes index.js ahí)

async function sincronizarBD() {
  try {
    console.log("⏳ Sincronizando modelos con la base de datos...");

    console.log("DB_USER:", process.env.DB_USER);
    console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
    console.log("DB_NAME:", process.env.DB_NAME);

    await sequelize.sync({ alter: true }); // ahora sí funciona

    console.log("✅ Base de datos sincronizada correctamente.");
    process.exit();
  } catch (error) {
    console.error("❌ Error al sincronizar la BD:", error);
    process.exit(1);
  }
}

sincronizarBD();
