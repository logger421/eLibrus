var express = require('express');
var router = express.Router();

// parent home page
router.get('/', function(req, res) {
	res.render('general/home', {user});
});

// parent attendance
router.get('/attendance', function(req, res) {
	res.render('parent/attendance', {user});
});

// parent grades
router.get('/grades', function(req, res) {
	res.render('parent/grades', {user});
});

// parent schedule
router.get('/schedule', function(req, res) {
	res.render('parent/schedule', {user});
});

// parent homeworks
router.get('/homeworks', function(req, res) {
	res.render('parent/homeworks', {user});
});

module.exports = router;
