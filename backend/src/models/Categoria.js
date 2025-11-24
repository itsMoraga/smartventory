module.exports = (sequelize, DataTypes) => {
  const Categoria = sequelize.define("Categoria", {
    id_categoria: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: "categorias",
    timestamps: false
  });

  return Categoria;
};
