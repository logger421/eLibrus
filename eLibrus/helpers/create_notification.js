const { sequelize } = require('../models');

const notification_student = async (student_id, subject_id) => {
    const [subject_name] = await sequelize.query(`
        SELECT nazwa FROM zajecia
        NATURAL JOIN przedmioty
        WHERE zajecia_id = ?
        `, {
            replacements: [subject_id]
    });
    await sequelize.query(`
        INSERT INTO wiadomosc
        (\`nadawca_id\`,\`odbiorca_id\`,\`typ\`,\`data\`,\`tytul\`, \`odczytana\`, \`usunieta\`)
        VALUES
        (?, ?, '2', CURDATE(), ?, 0, 0)
        `, {
        replacements: [student_id, student_id, `Twoje oceny z przedmiotu ${subject_name[0].nazwa} uległy zmianie`]
    });

    const [parent] = await sequelize.query(`
        SELECT rodzic.user_id, uczen.imie, uczen.nazwisko FROM rodzicielstwo 
        INNER JOIN uzytkownik AS rodzic ON rodzic.user_id = rodzic_id 
        INNER JOIN uzytkownik AS uczen ON uczen.user_id = dziecko_id 
        WHERE uczen.user_id = ?
        `, {
            replacements: [student_id]
    });

    if (parent.length > 0) {
        await sequelize.query(`
            INSERT INTO wiadomosc
            (\`nadawca_id\`,\`odbiorca_id\`,\`typ\`,\`data\`,\`tytul\`, \`odczytana\`, \`usunieta\`)
            VALUES
            (?, ?, '2', CURDATE(), ?, 0, 0)
            `, {
            replacements: [parent[0].user_id, parent[0].user_id, `Oceny dziecka ${parent[0].imie} ${parent[0].nazwisko} uległy zmianie`]
        });
    }

};

const notification_class = async (subject_id) => {
    const [subject_name] = await sequelize.query(`
        SELECT nazwa FROM zajecia
        NATURAL JOIN przedmioty
        WHERE zajecia_id = ?
        `, {
            replacements: [subject_id]
    });

    const [students] = await sequelize.query(`
        SELECT user_id FROM uzytkownik 
        WHERE klasa_id = (SELECT klasa_id FROM zajecia WHERE zajecia_id = ?);
        `,{
            replacements: [subject_id]
        });

    for(var i=0; i<students.length; i++) {
        await sequelize.query(`
            INSERT INTO wiadomosc
            (\`nadawca_id\`,\`odbiorca_id\`,\`typ\`,\`data\`,\`tytul\`, \`odczytana\`, \`usunieta\`)
            VALUES
            (?, ?, '2', CURDATE(), ?, 0, 0)
            `, {
            replacements: [students[i].user_id, students[i].user_id, `Pojawiła się nowa praca domowa z przedmiotu ${subject_name[0].nazwa}`]
        });
    }
};

const notification_teacher = async (student_id) => {
    const [result] = await sequelize.query(`
        SELECT uczen.klasa_id as uczen_klasa, uczen.imie AS uczen_imie, uczen.nazwisko AS uczen_nazwisko, 
        rodzic.imie AS rodzic_imie, rodzic.nazwisko AS rodzic_nazwisko FROM rodzicielstwo
        INNER JOIN uzytkownik AS uczen ON uczen.user_id = dziecko_id 
        INNER JOIN uzytkownik AS rodzic ON rodzic.user_id = rodzic_id
        WHERE uczen.user_id = ?
        `, {
            replacements: [student_id]
    });

    const [teacher] = await sequelize.query(`
        SELECT wychowawca_id FROM klasa 
        WHERE klasa_id = ?
        `,{
            replacements: [result[0].uczen_klasa]
        });

    await sequelize.query(`
        INSERT INTO wiadomosc
        (\`nadawca_id\`,\`odbiorca_id\`,\`typ\`,\`data\`,\`tytul\`, \`odczytana\`, \`usunieta\`)
        VALUES
        (?, ?, '2', CURDATE(), ?, 0, 0)
        `, {
        replacements: [teacher[0].wychowawca_id, teacher[0].wychowawca_id, 
        `Uczeń ${result[0].uczen_imie} ${result[0].uczen_nazwisko} 
        został usprawiedliwiony przez rodzica ${result[0].rodzic_imie} ${result[0].rodzic_nazwisko}`]
    });
}

module.exports = { notification_class, notification_student, notification_teacher }