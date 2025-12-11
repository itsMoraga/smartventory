module.exports = (sequelize, DataTypes) => {
  const Producto = sequelize.define("Producto", {
    id_producto: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    precio: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    stock_minimo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: "productos",
    timestamps: false
  });

  return Producto;
};
