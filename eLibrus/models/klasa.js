const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('klasa', {
    klasa_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    wychowawca_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'uzytkownik',
        key: 'user_id'
      }
    }
  }, {
    sequelize,
    tableName: 'klasa',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "klasa_id" },
        ]
      },
      {
        name: "klasa_wychowawca_id_foreign",
        using: "BTREE",
        fields: [
          { name: "wychowawca_id" },
        ]
      },
    ]
  });
};
