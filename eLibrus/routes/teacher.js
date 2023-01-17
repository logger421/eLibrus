var express = require("express");
var router = express.Router();
const sequelize = require("../models").sequelize;

const { getClass, getSubject } = require("../helpers/teacher_classes_subjects");
const {
    uzytkownik,
    klasa,
    zajecia,
    przedmioty,
    frekwencja,
    data_zajec
} = require("../models");

// teacher home page
router.get('/', async function(req, res) {
    const [notes, meta] = await sequelize.query(`
		SELECT tytul, tresc FROM ogloszenia;
	`);
	res.render('general/home', {user: req.user, notes});
});

// teacher attendance
router.get("/attendance", async function (req, res) {
    const classes = await getClass(req.user.dataValues.user_id);
    let class_id = req.query.class_id;
    if (typeof class_id == "undefined") {
        class_id = classes[0].klasa_id;
    }
    const subjects = await getSubject(req.user.dataValues.user_id, class_id);
    const temp = new Set();

    let selectedDate = req.query.attendance_date;
    if (typeof selectedDate == "undefined") {
        let current_day = new Date();
        selectedDate = current_day.toISOString().split("T")[0];
    }
    let date = new Date(selectedDate);
    let day = ["Poniedzialek", "Wtorek", "Sroda", "Czwartek", "Piatek", "Sobota", "Niedziela"][date.getUTCDay()]

    // const classes_numbers = await zajecia.findAll({
    //     include: [
    //         {
    //             model: data_zajec,
    //             where: { klasa_id: class_id, dzien: day },
    //         },
    //     ],
    // });


    const [classes_numbers, metadata] = await sequelize.query(
        `SELECT * FROM zajecia NATURAL JOIN data_zajec WHERE klasa_id=${class_id} AND dzien="${day}"`
    );

    const filteredSubjects = subjects.filter((el) => {
        const duplicate = temp.has(el.nazwa);
        temp.add(el.nazwa);
        return !duplicate;
    });

    students = await uzytkownik.findAll({
        where: {
            klasa_id: class_id,
        },
    });

    res.render("teacher/attendance", {
        user: req.user,
        class_id: class_id,
        subjects: filteredSubjects,
        classes: classes,
        students: students,
        date: selectedDate,
        classes_numbers: classes_numbers
    });
});

router.post("/attendance", (req, res) => {
    console.log(req.body)
    res.redirect("/teacher/attendance")
})

// teacher grades
router.get('/grades', async function(req, res) {    
    if (req.query.user_id) {
        let { user_id, subject_id, grade_value } = req.query;
        if (typeof(user_id) == "string") user_id = [user_id];
        
        for (var i=0; i<user_id.length; i++) {
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
    if (!req.query.class_id) 
        class_id = classes[0].klasa_id;
    else 
        class_id = req.query.class_id;
    const subjects = await getSubject(req.user.dataValues.user_id, class_id);

    if (!req.query.subject_id) 
        subject_id = subjects[0].zajecia_id;
    else 
        subject_id = req.query.subject_id;

    const [students, meta_students] = await sequelize.query(`
        SELECT user_id, imie, nazwisko FROM zajecia 
        NATURAL JOIN uzytkownik
        WHERE zajecia_id = ${subject_id}
    `);

    let students_grades = [];

    for(var i=0; i<students.length; i++) {
        const [temp_grades, metadata_oceny] = await sequelize.query(`
            SELECT ocena FROM oceny 
            NATURAL JOIN zajecia NATURAL JOIN uzytkownik 
            WHERE user_id = ${students[i].user_id} 
            AND zajecia_id = ${subject_id}
        `);
        const grades = temp_grades.map(grade => { return grade.ocena })
        students_grades.push(grades);
    }

	res.render('teacher/grades', {user: req.user, classes, subjects, class_id, subject_id, students, students_grades});
});

router.get('/grades/edit_grades/:subject_id/:user_id', async (req, res) => {
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
        grades.forEach(grade => { avg += grade.ocena; })
    }

    if (avg > 0) avg = avg / grades.length;

    res.render('teacher/edit_grades', {user: req.user, result: result[0], grades, avg});
}) 

router.post('/grades/edit_grades', async (req, res) => {
    let result = req.body;
    for(var key in result) {
        if (result[key] == 'remove') {
            await sequelize.query(`
                DELETE FROM oceny
                WHERE ocena_id = ${key}
            `);
        }
        else if (key == 'add') {
            if ( result[key] > 0 ) {
                await sequelize.query(`
                    INSERT oceny
                    (\`ocena\`, \`user_id\`, \`zajecia_id\`)
                    values(${result[key]}, ${result['user_id']}, ${result['subject_id']})
                `);
            }
        }
        else if (/^[0-9]+/.test(key)) {
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
    });
});

// teacher homeworks
router.get('/homeworks', async function(req, res) {
    const [homeworks, metadata] = await sequelize.query(`
    SELECT zajecia.klasa_id, termin_oddania, tytul, opis, nazwa, zadanie_id FROM zadanie_domowe 
    NATURAL JOIN zajecia NATURAL JOIN przedmioty INNER JOIN uzytkownik AS prowadzacy 
    ON prowadzacy.user_id = prowadzacy_id WHERE prowadzacy.user_id = ${req.user.dataValues.user_id}
    `);
    const classes = await getClass(req.user.dataValues.user_id);
    let class_id = 0;
    if (!req.query.class_id) 
        class_id = classes[0].klasa_id;
    else 
        class_id = req.query.class_id;
        
    const subjects = await getSubject(req.user.dataValues.user_id, class_id);

	const temp = new Set();

	const filteredSubjects = subjects.filter(el => {
		const duplicate = temp.has(el.nazwa);
		temp.add(el.nazwa);
		return !duplicate;
	});
	res.render('teacher/homeworks', {user: req.user, subjects: filteredSubjects, classes, homeworks, class_id});
});

router.post('/homeworks', async function(req, res) {
	const { subject_id, deadline, title, description } = req.body;
    
    if (title != '' && description != '' && deadline != '') {
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
