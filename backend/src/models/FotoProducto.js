module.exports = (sequelize, DataTypes) => {
  const FotoProducto = sequelize.define("FotoProducto", {
    id_foto: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: "fotos_producto",
    timestamps: false
  });

  return FotoProducto;
};
