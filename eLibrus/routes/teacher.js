var express = require('express');
var router = express.Router();
let user = {role: 3, name: 'Jan Kowalski'};

// teacher home page
router.get('/', function(req, res) {
	res.render('general/home', {user});
});

// teacher attendance
router.get('/attendance', function(req, res) {
	res.render('teacher/attendance', {user});
});

// teacher grades
router.get('/grades', function(req, res) {
	res.render('teacher/grades', {user});
});

// teacher schedule
router.get('/schedule', function(req, res) {
	res.render('teacher/schedule', {user});
});

// teacher homeworks
router.get('/homeworks', function(req, res) {
	res.render('teacher/homeworks', {user});
});

module.exports = router;
