module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define("Usuario", {
    id_usuario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    contrasena: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: "usuarios",
    timestamps: false
  });

  return Usuario;
};
