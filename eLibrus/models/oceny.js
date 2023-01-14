const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('oceny', {
    ocena_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ocena: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'uzytkownik',
        key: 'user_id'
      }
    },
    zajecia_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'zajecia',
        key: 'zajecia_id'
      }
    }
  }, {
    sequelize,
    tableName: 'oceny',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ocena_id" },
        ]
      },
      {
        name: "oceny_user_id_foreign",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "oceny_zajecia_id_foreign",
        using: "BTREE",
        fields: [
          { name: "zajecia_id" },
        ]
      },
    ]
  });
};
