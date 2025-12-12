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
    },
    id_empresa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'empresas',
        key: 'id_empresa'
      }
    }
  }, {
    tableName: "categorias",
    timestamps: false
  });

  return Categoria;
};
