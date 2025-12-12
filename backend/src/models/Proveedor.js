module.exports = (sequelize, DataTypes) => {
  const Proveedor = sequelize.define("Proveedor", {
    id_proveedor: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 100],
          msg: "El nombre de la empresa debe tener entre 2 y 100 caracteres"
        }
      }
    },
    contacto: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [2, 100],
          msg: "El nombre del contacto debe tener entre 2 y 100 caracteres"
        }
      }
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [8, 20],
          msg: "El teléfono debe tener entre 8 y 20 caracteres"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: {
          msg: "Debe proporcionar un correo electrónico válido"
        }
      }
    },
    direccion: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: "La dirección no puede exceder los 255 caracteres"
        }
      }
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
    tableName: "proveedores",
    timestamps: false
  });

  return Proveedor;
};
