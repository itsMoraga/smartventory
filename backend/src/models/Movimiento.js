module.exports = (sequelize, DataTypes) => {
  const Movimiento = sequelize.define("Movimiento", {
    id_movimiento: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM('entrada', 'salida', 'ajuste'),
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    observaciones: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: "movimientos",
    timestamps: false
  });

  return Movimiento;
};
