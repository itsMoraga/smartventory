-- Tabla para historial de movimientos de inventario
CREATE TABLE IF NOT EXISTS movimientos (
  id_movimiento INT AUTO_INCREMENT PRIMARY KEY,
  id_producto INT NOT NULL,
  tipo ENUM('entrada','salida','ajuste') NOT NULL,
  cantidad INT NOT NULL,
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_usuario INT,
  observaciones VARCHAR(255),
  FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);