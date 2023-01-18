const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('wiadomosc', {
    wiadomosc_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nadawca_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'uzytkownik',
        key: 'user_id'
      }
    },
    odbiorca_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'uzytkownik',
        key: 'user_id'
      }
    },
    typ: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    data: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    tytul: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tresc: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    odczytana: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    usunieta: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'wiadomosc',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "wiadomosc_id" },
        ]
      },
      {
        name: "wiadomosc_nadawca_id_foreign",
        using: "BTREE",
        fields: [
          { name: "nadawca_id" },
        ]
      },
      {
        name: "wiadomosc_odbiorca_id_foreign",
        using: "BTREE",
        fields: [
          { name: "odbiorca_id" },
        ]
      },
    ]
  });
};
