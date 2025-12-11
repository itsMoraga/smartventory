-- Migración para agregar el campo 'rol' a la tabla 'usuarios'
ALTER TABLE usuarios
ADD COLUMN rol VARCHAR(50) NOT NULL DEFAULT 'operador';
