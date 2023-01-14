const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('rodzicielstwo', {
    dziecko_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'uzytkownik',
        key: 'user_id'
      }
    },
    rodzic_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'uzytkownik',
        key: 'user_id'
      }
    }
  }, {
    sequelize,
    tableName: 'rodzicielstwo',
    timestamps: false,
    indexes: [
      {
        name: "rodzicielstwo_dziecko_id_foreign",
        using: "BTREE",
        fields: [
          { name: "dziecko_id" },
        ]
      },
      {
        name: "rodzicielstwo_rodzic_id_foreign",
        using: "BTREE",
        fields: [
          { name: "rodzic_id" },
        ]
      },
    ]
  });
};
