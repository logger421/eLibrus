var express = require("express");
var router = express.Router();
const sequelize = require("../models").sequelize;
const querystring = require('querystring');    
const change_password = require("../helpers/change_pass");
const { getClass, getSubject } = require("../helpers/teacher_classes_subjects");
const {
    uzytkownik,
    klasa,
    zajecia,
    przedmioty,
    frekwencja,
    data_zajec,
} = require("../models");

// teacher home page
router.get("/", async function (req, res) {
    const [notes, meta] = await sequelize.query(`
        SELECT tytul, tresc FROM ogloszenia
        ORDER BY id DESC
	`);
    res.render("general/home", { user: req.user, notes, current_path: 'teacher' });
});

router.get('/change_password', (req, res) => {
    res.render("general/change_password", {user: req.user, current_path: 'change_password'});
});

router.get('/notifications', (req, res) => {
    res.render('general/notifications', { user: req.user, current_path: 'notifications' })
});

router.post('/change_password', async (req, res) => {
    const { old_pass, new_pass, new_pass_again } = req.body;

    const result = await change_password(req.user.dataValues.user_id, old_pass, new_pass, new_pass_again);

    if (result[0] == 0) {
        for(let i=0; i<result[1].length; i++) 
            req.flash('error', result[1][i]);
    }
    else {
        req.flash('success_message', result[1][0]);
    }

    res.redirect('/teacher/change_password');
});

// teacher attendance
router.get("/attendance", async function (req, res) {
    const user_id = req.user.dataValues.user_id;
    const classes = await getClass(user_id);

    let selected_class = req.query.class_id;
    if (typeof selected_class == "undefined") {
        if (classes.length > 0 ) selected_class = classes[0].klasa_id;
        else selected_class = 0;
    }

    let selected_date = req.query.attendance_date;
    if (!selected_date) {
        let current_day = new Date();
        selected_date = current_day.toISOString().split("T")[0];
    }

    let date = new Date(selected_date);
    let selected_day = ["Niedziela","Poniedzialek","Wtorek","Sroda","Czwartek","Piatek","Sobota"][date.getDay()];

    const [subjects] = await sequelize.query(`
        SELECT zajecia_id, przedmioty.nazwa 
        FROM zajecia
        NATURAL JOIN przedmioty
        NATURAL JOIN data_zajec
        WHERE prowadzacy_id = ${user_id} AND klasa_id = ${selected_class} AND dzien="${selected_day}"
    `);

    const temp = new Set();
    const filtered_subjects = subjects.filter((el) => {
        const duplicate = temp.has(el.nazwa);
        temp.add(el.nazwa);
        return !duplicate;
    });

    // TODO: fix the case of no subjects
    let selected_subject = req.query.subject_id;
    if (typeof selected_subject == "undefined") {
        if (subjects.length == 0) selected_subject = 0;
        else selected_subject = subjects[0].zajecia_id;
    }

    const [classes_numbers] = await sequelize.query(
        `SELECT * FROM zajecia NATURAL JOIN data_zajec WHERE klasa_id=${selected_class} AND dzien="${selected_day}" AND zajecia_id=${selected_subject}`
    );

    // TODO: fix the case of no classes numbers
    let selected_classes_number = req.query.classes_number;
    if (typeof selected_classes_number == "undefined") {
        if(classes_numbers.length == 0) selected_classes_number = 0;
        else selected_classes_number = classes_numbers[0].nr_lekcji;
    }

    const [frekwencja] = await sequelize.query(
        `SELECT * FROM frekwencja WHERE zajecia_id=${selected_subject} AND data_zajec="${selected_date}" AND nr_lekcji=${selected_classes_number}`
    );

    const [students] = await sequelize.query(
        `SELECT * FROM uzytkownik WHERE klasa_id=${selected_class}`
    );

    // every student will have a field frekwencja from now on
    const studentsWithAttendance = students.map((student) => {
        const attendance = frekwencja.find(
            (f) => f.user_id === student.user_id
        );
        return {
            ...student,
            frekwencja: attendance ? attendance.frekwencja : "-",
        };
    });

    res.render("teacher/attendance", {
        user: req.user,
        students: studentsWithAttendance,
        date: selected_date,
        classes: classes,
        class_id: selected_class,
        subjects: filtered_subjects,
        subject_id: selected_subject,
        classes_numbers: classes_numbers,
        class_number: selected_classes_number,
        current_path: 'attendance'
    });
});

router.post("/attendance", async (req, res) => {
    const attendance_list = Object.entries(req.body)
        .filter(
            ([key]) =>
                key !== "zajecia_id" && key !== "date" && key !== "nr_lekcji" && key !== "klasa_id"
        )
        .map(([id, value]) => ({ user_id: id, frekwencja: value }));

    await attendance_list.forEach((item) => {
        frekwencja
            .findOne({
                where: {
                    user_id: item.user_id,
                    data_zajec: req.body.date,
                    zajecia_id: req.body.zajecia_id,
                    nr_lekcji: req.body.nr_lekcji,
                },
            })
            .then((attendance) => {
                if (attendance) {
                    attendance.update({
                        frekwencja: item.frekwencja,
                    });
                } else {
                    const newAttendance = frekwencja.build({
                        zajecia_id: req.body.zajecia_id,
                        user_id: item.user_id,
                        data_zajec: req.body.date,
                        frekwencja: item.frekwencja,
                        nr_lekcji: req.body.nr_lekcji,
                    });
                    newAttendance.save();
                }
            });
    });

    const query = querystring.stringify({
        class_id: req.body.klasa_id,
        attendance_date: req.body.date,
        subject_id: req.body.zajecia_id,
        classes_number: req.body.nr_lekcji,
    });
    res.redirect(`/teacher/attendance?${query}`);
});

// teacher grades
router.get("/grades", async function (req, res) {
    if (req.query.user_id) {
        let { user_id, subject_id, grade_value } = req.query;
        if (typeof user_id == "string") user_id = [user_id];

        for (var i = 0; i < user_id.length; i++) {
            await sequelize.query(`
                INSERT INTO oceny 
                (\`ocena\`, \`user_id\`, \`zajecia_id\`)
                VALUES 
                (${grade_value}, ${user_id[i]}, ${subject_id})
            `);
        }
    }
    const classes = await getClass(req.user.dataValues.user_id);
    let class_id = 0, subject_id = 0;
    if (!req.query.class_id && classes.length > 0) class_id = classes[0].klasa_id;
    if(req.query.class_id) class_id = req.query.class_id;
    const subjects = await getSubject(req.user.dataValues.user_id, class_id);

    if (!req.query.subject_id && subjects.length > 0) subject_id = subjects[0].zajecia_id;
    if(req.query.subject_id) subject_id = req.query.subject_id;

    const [students, meta_students] = await sequelize.query(`
        SELECT user_id, imie, nazwisko FROM zajecia 
        NATURAL JOIN uzytkownik
        WHERE zajecia_id = ${subject_id}
    `);

    let students_grades = [];

    for (var i = 0; i < students.length; i++) {
        const [temp_grades, metadata_oceny] = await sequelize.query(`
            SELECT ocena FROM oceny 
            NATURAL JOIN zajecia NATURAL JOIN uzytkownik 
            WHERE user_id = ${students[i].user_id} 
            AND zajecia_id = ${subject_id}
        `);
        const grades = temp_grades.map((grade) => {
            return grade.ocena;
        });
        students_grades.push(grades);
    }

    res.render("teacher/grades", {
        user: req.user,
        classes,
        subjects,
        class_id,
        subject_id,
        students,
        students_grades,
        current_path: 'grades'
    });
});

router.get("/grades/edit_grades/:subject_id/:user_id", async (req, res) => {
    const { user_id, subject_id } = req.params;

    const [result, meta] = await sequelize.query(`
        SELECT user_id, zajecia_id, imie, nazwisko, klasa_id, nazwa FROM uzytkownik
        NATURAL JOIN zajecia natural join przedmioty
        WHERE user_id = ${user_id} AND zajecia_id = ${subject_id}
    `);

    const [grades, meta_grades] = await sequelize.query(`
        SELECT ocena_id, ocena FROM uzytkownik 
        NATURAL JOIN oceny 
        WHERE user_id = ${user_id} AND zajecia_id = ${subject_id}
    `);

    let avg = 0;
    if (grades.length > 0) {
        grades.forEach((grade) => {
            avg += grade.ocena;
        });
    }

    if (avg > 0) avg = avg / grades.length;

    res.render("teacher/edit_grades", {
        user: req.user,
        result: result[0],
        grades,
        avg,
        current_path: 'edit_grades'
    });
});

router.post("/grades/edit_grades", async (req, res) => {
    let result = req.body;
    for (var key in result) {
        if (result[key] == "remove") {
            await sequelize.query(`
                DELETE FROM oceny
                WHERE ocena_id = ${key}
            `);
        } else if (key == "add") {
            if (result[key] > 0) {
                await sequelize.query(`
                    INSERT oceny
                    (\`ocena\`, \`user_id\`, \`zajecia_id\`)
                    values(${result[key]}, ${result["user_id"]}, ${result["subject_id"]})
                `);
            }
        } else if (/^[0-9]+/.test(key)) {
            await sequelize.query(`
                UPDATE oceny
                SET ocena = ${result[key]}
                WHERE ocena_id = ${key}
            `);
        }
    }
    req.flash('success_message', 'Zmiany zostały zapisane');
    res.redirect('/teacher/grades');
});

// teacher schedule
router.get("/schedule", async function (req, res) {
    const [result, metadata] = await sequelize.query(
        `SELECT nazwa, dzien, nr_lekcji FROM zajecia 
        NATURAL JOIN data_zajec NATURAL JOIN przedmioty INNER JOIN uzytkownik
        ON prowadzacy_id = user_id 
        WHERE prowadzacy_id = ${req.user.user_id}`
    );

    let dni = ["Poniedzialek", "Wtorek", "Sroda", "Czwartek", "Piatek"];
    let schedule = {
        1: ["", "", "", "", ""],
        2: ["", "", "", "", ""],
        3: ["", "", "", "", ""],
        4: ["", "", "", "", ""],
        5: ["", "", "", "", ""],
        6: ["", "", "", "", ""],
        7: ["", "", "", "", ""],
        8: ["", "", "", "", ""],
    };

    for (var i = 0; i < 5; i++) {
        for (var j = 1; j < 9; j++) {
            result.forEach((element) => {
                if (element.dzien == dni[i] && element.nr_lekcji == j) {
                    schedule[j][i] = element.nazwa;
                }
            });
        }
    }

    res.render("teacher/schedule", {
        user: req.user,
        students: req.students,
        current_student: req.user.user_id,
        schedule,
        current_path: 'schedule'
    });
});

// teacher homeworks
router.get("/homeworks", async function (req, res) {
    const [homeworks, metadata] = await sequelize.query(`
    SELECT zajecia.klasa_id, termin_oddania, tytul, opis, nazwa, zadanie_id FROM zadanie_domowe 
    NATURAL JOIN zajecia NATURAL JOIN przedmioty INNER JOIN uzytkownik AS prowadzacy 
    ON prowadzacy.user_id = prowadzacy_id WHERE prowadzacy.user_id = ${req.user.dataValues.user_id}
    `);
    const classes = await getClass(req.user.dataValues.user_id);
    let class_id = 0;
    if (classes.length > 0) class_id = classes[0].klasa_id;
    if (req.query.class_id) class_id = req.query.class_id;  

    const subjects = await getSubject(req.user.dataValues.user_id, class_id);

    const temp = new Set();

    const filteredSubjects = subjects.filter((el) => {
        const duplicate = temp.has(el.nazwa);
        temp.add(el.nazwa);
        return !duplicate;
    });
    res.render("teacher/homeworks", {
        user: req.user,
        subjects: filteredSubjects,
        classes,
        homeworks,
        class_id,
        current_path: 'homeworks'
    });
});

router.post("/homeworks", async function (req, res) {
    const { subject_id, deadline, title, description } = req.body;

    if (title != "" && description != "" && deadline != "") {
        await sequelize.query(`
            INSERT INTO zadanie_domowe 
            (\`zajecia_id\`, \`termin_oddania\`, \`tytul\`, \`opis\`)
            VALUES 
            (${subject_id}, '${deadline}', '${title}', '${description}')
        `);
        req.flash('success_message', 'Praca domowa została dodana');
    }

    if (deadline == '') req.flash('error', 'Nie wybrano terminu');
    if (title == '') req.flash('error', 'Nie wprowadzono tytułu');
    if (description == '') req.flash('error', 'Nie wprowadzono opisu');

	res.redirect('/teacher/homeworks');
});

router.post('/homeworks/delete_homework', async (req, res) => {
    console.log(req.body);
    await sequelize.query(`
        DELETE FROM zadanie_domowe 
        WHERE zadanie_id = ${req.body.to_delete}
    `);
    req.flash('success_message', 'Praca domowa została usunięta');
    res.redirect('/teacher/homeworks');
});

module.exports = router;
