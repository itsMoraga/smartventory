-- Agrega los campos cantidad y stock_minimo a la tabla productos
ALTER TABLE productos
ADD COLUMN cantidad INT NOT NULL DEFAULT 0,
ADD COLUMN stock_minimo INT NOT NULL DEFAULT 1;