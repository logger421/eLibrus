const { frekwencja, klasa, oceny, przedmioty, rodzicielstwo, sala, uzytkownik, wiadomosc, zadanie_domowe, zajecia, data_zajec } = require('../models');
 
const connect_tables = () => {
    uzytkownik.belongsTo(klasa, {foreignKey: "klasa_id"});
    klasa.hasMany(uzytkownik, {foreignKey: "klasa_id"});
    zajecia.belongsTo(klasa, {foreignKey: "klasa_id"});
    klasa.hasMany(zajecia, {foreignKey: "klasa_id"});
    zajecia.belongsTo(przedmioty, {foreignKey: "przedmiot_id"});
    przedmioty.hasMany(zajecia, {foreignKey: "przedmiot_id"});
    zajecia.belongsTo(sala, {foreignKey: "sala_id"});
    sala.hasMany(zajecia, {foreignKey: "sala_id"});
    frekwencja.belongsTo(uzytkownik, {foreignKey: "user_id"});
    uzytkownik.hasMany(frekwencja, {foreignKey: "user_id"});
    klasa.belongsTo(uzytkownik, {foreignKey: "wychowawca_id"});
    uzytkownik.hasMany(klasa, {foreignKey: "wychowawca_id"});
    oceny.belongsTo(uzytkownik, {foreignKey: "user_id"});
    uzytkownik.hasMany(oceny, {foreignKey: "user_id"});
    rodzicielstwo.belongsTo(uzytkownik, {foreignKey: "dziecko_id"});
    uzytkownik.hasMany(rodzicielstwo, {foreignKey: "dziecko_id"});
    rodzicielstwo.belongsTo(uzytkownik, {foreignKey: "rodzic_id"});
    uzytkownik.hasMany(rodzicielstwo, {foreignKey: "rodzic_id"});
    wiadomosc.belongsTo(uzytkownik, {foreignKey: "nadawca_id"});
    uzytkownik.hasMany(wiadomosc, {foreignKey: "nadawca_id"});
    wiadomosc.belongsTo(uzytkownik, {foreignKey: "odbiorca_id"});
    uzytkownik.hasMany(wiadomosc, {foreignKey: "odbiorca_id"});
    zajecia.belongsTo(uzytkownik, {foreignKey: "prowadzacy_id"});
    uzytkownik.hasMany(zajecia, {foreignKey: "prowadzacy_id"});
    data_zajec.belongsTo(zajecia, {foreignKey: "zajecia_id"});
    zajecia.hasMany(data_zajec, {foreignKey: "zajecia_id"});
    frekwencja.belongsTo(zajecia, {foreignKey: "zajecia_id"});
    zajecia.hasMany(frekwencja, {foreignKey: "zajecia_id"});
    oceny.belongsTo(zajecia, {foreignKey: "zajecia_id"});
    zajecia.hasMany(oceny, {foreignKey: "zajecia_id"});
    zadanie_domowe.belongsTo(zajecia, {foreignKey: "zajecia_id"});
    zajecia.hasMany(zadanie_domowe, {foreignKey: "zajecia_id"});
}

module.exports = connect_tables;