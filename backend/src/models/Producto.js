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
    precio_costo: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0.00
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    unidad_medida: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'unidad'
    },
    ubicacion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fecha_caducidad: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    stock_minimo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    id_empresa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'empresas',
        key: 'id_empresa'
      }
    },
    id_proveedor: {
      type: DataTypes.INTEGER,
      allowNull: true
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
