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
        `SELECT nr_lekcji, dzien, przedmioty.nazwa FROM zajecia 
        NATURAL JOIN uzytkownik NATURAL JOIN przedmioty WHERE prowadzacy_id = ${req.user.user_id}`
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
	const classes = await getClass(req.user.dataValues.user_id);
	const subjects = await getSubject(req.user.dataValues.user_id, 1);
	const temp = new Set();

	const filteredSubjects = subjects.filter(el => {
		const duplicate = temp.has(el.nazwa);
		temp.add(el.nazwa);
		return !duplicate;
	});
	
	res.render('teacher/homeworks', {user: req.user, subjects: filteredSubjects, classes});
});

router.post('/homeworks', async function(req, res) {
	console.log(req.body);
	res.redirect('/teacher/homeworks');
});

module.exports = router;
