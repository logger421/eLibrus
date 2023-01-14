var express = require('express');
var router = express.Router();
let user = {role: 1, name: 'Jan Kowalski'};

const { uzytkownik, klasa, zajecia, przedmioty } = require('../models');
 
// student home page
router.get('/', async function(req, res) {
	let result = await uzytkownik.findAll(
		{
			include: [{
				model: zajecia,
				required: true
			},
		]
		}
	);
	console.log(result[0].dataValues);
	res.render('general/home', {user});
});

// student attendance
router.get('/attendance', function(req, res) {
	res.render('student/attendance', {user});
});

// student grades
router.get('/grades', function(req, res) {
	res.render('student/grades', {user});
});

// student schedule
router.get('/schedule', function(req, res) {
	res.render('student/schedule', {user});
});

// student homeworks
router.get('/homeworks', function(req, res) {
	res.render('student/homeworks', {user});
});

module.exports = router;
