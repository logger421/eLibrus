var express = require('express');
var router = express.Router();

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
router.get('/homeworks', function(req, res) {
	res.render('teacher/homeworks', {user: req.user});
});

module.exports = router;
