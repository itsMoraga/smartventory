module.exports = (sequelize, DataTypes) => {
  const Empresa = sequelize.define("Empresa", {
    id_empresa: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    zona_horaria: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'UTC'
    },
    moneda: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'USD'
    },
    pais: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: "empresas",
    timestamps: true
  });

  return Empresa;
};
