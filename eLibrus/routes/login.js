const cookieParser = require('cookie-parser');
var express = require('express');
var router = express.Router();
const passport = require('passport');
const { sequelize } = require('../models');

/*
=================
NOT LOGGED IN HOME PAGE 
=================
*/

router.get('/', async (req, res) => {
	const [notes, meta] = await sequelize.query(`
		SELECT tytul, tresc FROM ogloszenia
		ORDER BY id DESC
	`);

	res.render('general/home', { notes, hidden: false });
});

/*
=================
NOT LOGGED IN LOGIN 
=================
*/

router.get('/login', (req, res) => {
	res.render('general/login', { hidden: true });
});


router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/home/login',
		failureFlash: true,
		badRequestMessage: 'Dane logowania nie są poprawne'
	})(req, res, next);
});

/*
=================
NOT LOGGED IN REMIND PASSWORD 
=================
*/

router.get('/remind_password', (req, res) => {
	res.render('general/remind_password', {hidden: false});
});

router.post('/remind_password', (req, res) => {
	const { email } = req.body;
	
	if (email) {
		req.flash('success_message', 'Prośba o zresetowanie hasła została wysłana!');
	}
	else {
		req.flash('error', 'Należy podać adres e-mail');
	}

	res.redirect('/home/remind_password');
});


/*
=================
LOGGED IN LOGOUT 
=================
*/

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


