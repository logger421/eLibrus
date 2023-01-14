var express = require('express');
var router = express.Router();

const sequelize = require('../models').sequelize;

router.get('*', async function (req, res, next) {
	const [result, metadata] = await sequelize.query(
		`SELECT uczen.user_id, uczen.imie, uczen.nazwisko FROM rodzicielstwo 
		JOIN uzytkownik AS rodzic JOIN uzytkownik AS uczen 
		ON rodzic.user_id = rodzicielstwo.rodzic_id AND uczen.user_id = rodzicielstwo.dziecko_id`
	);
	if (!req.cookies.current_student)
		res.cookie('current_student', result[0].user_id);
	req.students = result;
	
	next();
});

// parent home page
router.get('/', async function(req, res) {
	res.render('general/home', { user: req.user, students: req.students, current_student: req.cookies.current_student});
});

// parent attendance
router.get('/attendance', function(req, res) {
	res.render('parent/attendance', { user: req.user, students: req.students, current_student: req.cookies.current_student});
});

// parent grades
router.get('/grades', function(req, res) {
	res.render('parent/grades', { user: req.user, students: req.students, current_student: req.cookies.current_student});
});

// parent schedule
router.get('/schedule', async function(req, res) {
	const [result, metadata] = await sequelize.query(
		`SELECT nr_lekcji, dzien, przedmioty.nazwa FROM zajecia 
		NATURAL JOIN uzytkownik NATURAL JOIN przedmioty WHERE user_id = ${req.cookies.current_student}`
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

	for (var i=0; i<5; i++) {
		for(var j=1; j<9; j++) {
			result.forEach(element => {
				if (element.dzien == dni[i] && element.nr_lekcji == j) {
					schedule[j][i] = element.nazwa;
				}
			});
		}
	}

	res.render('parent/schedule', { user: req.user, students: req.students, current_student: req.cookies.current_student, schedule});
});

// parent homeworks
router.get('/homeworks', async function(req, res) {
	const [homeworks, metadata] = await sequelize.query(`
		SELECT prowadzacy.imie, prowadzacy.nazwisko, termin_oddania, tytul, opis, przedmioty.nazwa FROM zadanie_domowe 
		NATURAL JOIN zajecia NATURAL JOIN przedmioty NATURAL JOIN uzytkownik AS uczen inner join uzytkownik AS prowadzacy 
		ON prowadzacy.user_id = prowadzacy_id where uczen.user_id = ${req.cookies.current_student}`
	);
	
	res.render('parent/homeworks', { user: req.user, students: req.students, current_student: req.cookies.current_student, homeworks});
});

router.post('/change_student', function(req, res) {
	res.cookie('current_student', req.body.selected_student);
	res.redirect('/');
});

module.exports = router;
