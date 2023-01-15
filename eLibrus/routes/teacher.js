var express = require('express');
var router = express.Router();

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
router.get('/schedule', function(req, res) {
	res.render('teacher/schedule', {user: req.user});
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
