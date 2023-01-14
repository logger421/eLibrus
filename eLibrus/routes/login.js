const cookieParser = require('cookie-parser');
var express = require('express');
var router = express.Router();
const passport = require('passport');

// home page unauthenticated
router.get('/', (req, res) => {
	res.render('general/home');
});

// login page get / post
router.get('/login', (req, res) => {
	res.render('general/login');
});


router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/home/login',
	})(req, res, next);
});

// remind password page get / post
router.get('/remind_password', (req, res) => {
	res.render('general/remind_password');
});

router.post('/remind_password', (req, res) => {
	const { email } = req.body;
	
	if (email) {
		
	}

	res.render('general/remind_password');
});

router.get('/logout', (req, res, next) => {
	req.logout((err) => {
        if (err) { return next(err); }
        for (var cookie in req.cookies) {
            res.cookie(cookie, '', {expires: new Date(0)});
        }
        res.redirect('/home/login');
    });
});

module.exports = router;


