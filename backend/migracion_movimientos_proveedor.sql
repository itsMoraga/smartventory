ALTER TABLE movimientos
ADD COLUMN id_proveedor INT NULL,
ADD CONSTRAINT fk_movimiento_proveedor
FOREIGN KEY (id_proveedor) REFERENCES proveedores(id_proveedor)
ON DELETE SET NULL
ON UPDATE CASCADE;
