const mysql = require('mysql2/promise');
require('dotenv').config();

(async ()=>{
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'appdb'
  });
  const [rows] = await conn.execute('SELECT * FROM movimientos ORDER BY id_movimiento DESC LIMIT 5');
  console.log(rows);
  await conn.end();
})();