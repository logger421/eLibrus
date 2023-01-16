const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('data_zajec', {
    data_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    dzien: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nr_lekcji: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    tableName: 'data_zajec',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "data_id" },
        ]
      },
      {
        name: "data_zajec_zajecia_id_foreign",
        using: "BTREE",
        fields: [
          { name: "zajecia_id" },
        ]
      },
    ]
  });
};
