-- Crear tabla proveedores
CREATE TABLE IF NOT EXISTS proveedores (
  id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  contacto VARCHAR(100),
  telefono VARCHAR(20),
  email VARCHAR(100),
  direccion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Agregar relación a productos
ALTER TABLE productos
ADD COLUMN id_proveedor INT NULL,
ADD CONSTRAINT fk_producto_proveedor
FOREIGN KEY (id_proveedor) REFERENCES proveedores(id_proveedor)
ON DELETE SET NULL
ON UPDATE CASCADE;
