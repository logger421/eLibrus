var express = require('express');
var router = express.Router();

// student home page
router.get('/', function(req, res) {
	res.render('general/home', {user: req.user});
});

// student attendance
router.get('/attendance', function(req, res) {
	res.render('student/attendance', {user: req.user});
});

// student grades
router.get('/grades', function(req, res) {
	res.render('student/grades', {user: req.user});
});

// student schedule
router.get('/schedule', function(req, res) {
	res.render('student/schedule', {user: req.user});
});

// student homeworks
router.get('/homeworks', function(req, res) {
	res.render('student/homeworks', {user: req.user});
});

module.exports = router;
