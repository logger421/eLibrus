var express = require('express');
var router = express.Router();
const sequelize = require("../models").sequelize;

const { getClass, getSubject } = require('../helpers/teacher_classes_subjects');

// teacher home page
router.get('/', function(req, res) {
	res.render('general/home', {user: req.user});
});

// teacher attendance
router.get('/attendance', function(req, res) {
	res.render('teacher/attendance', {user: req.user});
});

// teacher grades
router.get('/grades', function(req, res) {
	res.render('teacher/grades', {user: req.user});
});

// teacher schedule
router.get("/schedule", async function (req, res) {
    const [result, metadata] = await sequelize.query(
        `SELECT nazwa, dzien, nr_lekcji FROM zajecia 
        NATURAL JOIN data_zajec NATURAL JOIN przedmioty NATURAL JOIN uzytkownik 
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
    SELECT zajecia.klasa_id, termin_oddania, tytul, opis, nazwa FROM zadanie_domowe 
    NATURAL JOIN zajecia NATURAL JOIN przedmioty NATURAL JOIN uzytkownik AS uczen INNER JOIN uzytkownik AS prowadzacy 
    ON prowadzacy.user_id = prowadzacy_id WHERE prowadzacy.user_id = ${req.user.dataValues.user_id}
    `);
    
    const classes = await getClass(req.user.dataValues.user_id);
	const subjects = await getSubject(req.user.dataValues.user_id, 1);
	const temp = new Set();

	const filteredSubjects = subjects.filter(el => {
		const duplicate = temp.has(el.nazwa);
		temp.add(el.nazwa);
		return !duplicate;
	});
	
	res.render('teacher/homeworks', {user: req.user, subjects: filteredSubjects, classes, homeworks});
});

router.post('/homeworks', async function(req, res) {
	await sequelize.query();
	res.redirect('/teacher/homeworks');
});

module.exports = router;
