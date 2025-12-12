const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

// Importar modelos
const Empresa = require("./Empresa")(sequelize, DataTypes);
const Usuario = require("./Usuario")(sequelize, DataTypes);
const Categoria = require("./Categoria")(sequelize, DataTypes);
const Producto = require("./Producto")(sequelize, DataTypes);
const FotoProducto = require("./FotoProducto")(sequelize, DataTypes);
const Movimiento = require("./Movimiento")(sequelize, DataTypes);
const Proveedor = require("./Proveedor")(sequelize, DataTypes);

// Relaciones Multi-Tenant (Empresa tiene muchos...)
Empresa.hasMany(Usuario, { foreignKey: "id_empresa" });
Usuario.belongsTo(Empresa, { foreignKey: "id_empresa" });

Empresa.hasMany(Producto, { foreignKey: "id_empresa" });
Producto.belongsTo(Empresa, { foreignKey: "id_empresa" });

Empresa.hasMany(Categoria, { foreignKey: "id_empresa" });
Categoria.belongsTo(Empresa, { foreignKey: "id_empresa" });

Empresa.hasMany(Movimiento, { foreignKey: "id_empresa" });
Movimiento.belongsTo(Empresa, { foreignKey: "id_empresa" });

Empresa.hasMany(Proveedor, { foreignKey: "id_empresa" });
Proveedor.belongsTo(Empresa, { foreignKey: "id_empresa" });

// Movimiento pertenece a Producto y Usuario
Movimiento.belongsTo(Producto, { foreignKey: "id_producto" });
Movimiento.belongsTo(Usuario, { foreignKey: "id_usuario" });
Movimiento.belongsTo(Proveedor, { foreignKey: "id_proveedor" });
Producto.hasMany(Movimiento, { foreignKey: "id_producto" });
Proveedor.hasMany(Movimiento, { foreignKey: "id_proveedor" });

// Relaciones
Usuario.hasMany(Producto, { foreignKey: "id_usuario" });
Producto.belongsTo(Usuario, { foreignKey: "id_usuario" });

Categoria.hasMany(Producto, { foreignKey: "id_categoria" });
Producto.belongsTo(Categoria, { foreignKey: "id_categoria" });

Proveedor.hasMany(Producto, { foreignKey: "id_proveedor" });
Producto.belongsTo(Proveedor, { foreignKey: "id_proveedor" });

Producto.hasMany(FotoProducto, { foreignKey: "id_producto" });
FotoProducto.belongsTo(Producto, { foreignKey: "id_producto" });

module.exports = {
  sequelize,
  Empresa,
  Usuario,
  Categoria,
  Producto,
  FotoProducto,
  Movimiento,
  Proveedor
};
