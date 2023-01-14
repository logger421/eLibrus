var express = require('express');
var router = express.Router();

// home page unauthenticated
router.get('/', (req, res) => {
	res.render('general/home');
});

// login page get / post
router.get('/login', (req, res) => {
	res.render('general/login');
});


router.post('/login', (req, res) => {
	const { email, password } = req.body;
	
	if (email && password) {

	}

	res.render('general/login');
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

module.exports = router;


