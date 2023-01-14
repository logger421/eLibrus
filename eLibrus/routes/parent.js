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
router.get('/schedule', function(req, res) {
	res.render('parent/schedule', { user: req.user, students: req.students, current_student: req.cookies.current_student});
});

// parent homeworks
router.get('/homeworks', function(req, res) {
	res.render('parent/homeworks', { user: req.user, students: req.students, current_student: req.cookies.current_student});
});

router.post('/change_student', function(req, res) {
	res.cookie('current_student', req.body.selected_student);
	res.redirect('/');
});

module.exports = router;
