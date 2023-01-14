var express = require('express');

const checkRole = (req, res) => {
    if (!req.user) res.redirect('/home');
    else {
        if (req.user.role == 1) {
            res.redirect('/student');
        }
        else if (req.user.role == 2) {
            res.redirect('/parent');
        }
        else if (req.user.role == 3) {
            res.redirect('/teacher');
        }
        else if (req.user.role == 4) {
            res.redirect('/administrator');
        }
    }
}

module.exports = { checkRole };