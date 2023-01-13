var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  user = {role: 'Uczen', name: 'Jan Kowalski'};
  res.render('student/attendance', {user: user});
});

module.exports = router;
