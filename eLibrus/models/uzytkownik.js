const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('uzytkownik', {
    user_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "uzytkownik_email_unique"
    },
    haslo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    imie: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nazwisko: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    pesel: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    data_urodzenia: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    miasto: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    kod_pocztowy: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ulica: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nr_mieszkania: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    rola: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    klasa_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'klasa',
        key: 'klasa_id'
      }
    },
    aktywny: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'uzytkownik',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "uzytkownik_email_unique",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "uzytkownik_klasa_id_foreign",
        using: "BTREE",
        fields: [
          { name: "klasa_id" },
        ]
      },
    ]
  });
};
