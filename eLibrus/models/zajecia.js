const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('zajecia', {
    zajecia_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    przedmiot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'przedmioty',
        key: 'przedmiot_id'
      }
    },
    prowadzacy_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'uzytkownik',
        key: 'user_id'
      }
    },
    sala_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sala',
        key: 'sala_id'
      }
    },
    klasa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'klasa',
        key: 'klasa_id'
      }
    }
  }, {
    sequelize,
    tableName: 'zajecia',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "zajecia_id" },
        ]
      },
      {
        name: "zajecia_prowadzacy_id_foreign",
        using: "BTREE",
        fields: [
          { name: "prowadzacy_id" },
        ]
      },
      {
        name: "zajecia_przedmiot_id_foreign",
        using: "BTREE",
        fields: [
          { name: "przedmiot_id" },
        ]
      },
      {
        name: "zajecia_klasa_id_foreign",
        using: "BTREE",
        fields: [
          { name: "klasa_id" },
        ]
      },
      {
        name: "zajecia_sala_id_foreign",
        using: "BTREE",
        fields: [
          { name: "sala_id" },
        ]
      },
    ]
  });
};
