const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
      "frekwencja",
      {
          zajecia_id: {
              type: DataTypes.INTEGER,
              allowNull: false,
              references: {
                  model: "zajecia",
                  key: "zajecia_id",
              },
          },
          user_id: {
              type: DataTypes.INTEGER,
              allowNull: false,
              references: {
                  model: "uzytkownik",
                  key: "user_id",
              },
          },
          data_zajec: {
              type: DataTypes.DATEONLY,
              allowNull: false,
          },
          frekwencja: {
              type: DataTypes.STRING(255),
              allowNull: false,
          },
          nr_lekcji: {
              type: DataTypes.INTEGER,
              allowNull: false,
          },
      },
      {
          sequelize,
          tableName: "frekwencja",
          timestamps: false,
          indexes: [
              {
                  name: "frekwencja_user_id_foreign",
                  using: "BTREE",
                  fields: [{ name: "user_id" }],
              },
              {
                  name: "frekwencja_zajecia_id_foreign",
                  using: "BTREE",
                  fields: [{ name: "zajecia_id" }],
              },
          ],
      }
  );
};
