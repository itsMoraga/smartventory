const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

// Importar modelos
const Usuario = require("./Usuario")(sequelize, DataTypes);
const Categoria = require("./Categoria")(sequelize, DataTypes);
const Producto = require("./Producto")(sequelize, DataTypes);
const FotoProducto = require("./FotoProducto")(sequelize, DataTypes);

// Relaciones
Usuario.hasMany(Producto, { foreignKey: "id_usuario" });
Producto.belongsTo(Usuario, { foreignKey: "id_usuario" });

Categoria.hasMany(Producto, { foreignKey: "id_categoria" });
Producto.belongsTo(Categoria, { foreignKey: "id_categoria" });

Producto.hasMany(FotoProducto, { foreignKey: "id_producto" });
FotoProducto.belongsTo(Producto, { foreignKey: "id_producto" });

module.exports = {
  sequelize,
  Usuario,
  Categoria,
  Producto,
  FotoProducto,
};
