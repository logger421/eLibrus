const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('zadanie_domowe', {
    zadanie_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    zajecia_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'zajecia',
        key: 'zajecia_id'
      }
    },
    termin_oddania: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    tytul: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    opis: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'zadanie_domowe',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "zadanie_id" },
        ]
      },
      {
        name: "zadanie_domowe_zajecia_id_foreign",
        using: "BTREE",
        fields: [
          { name: "zajecia_id" },
        ]
      },
    ]
  });
};
