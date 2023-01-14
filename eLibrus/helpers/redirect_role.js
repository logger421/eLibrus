var express = require('express');

const checkRole = (req, res) => {
    console.log(req.user);
    if (!req.user) res.redirect('/home');
    else {
        if (req.user.dataValues.rola == 1) {
            res.redirect('/student');
        }
        else if (req.user.dataValues.rola == 2) {
            res.redirect('/parent');
        }
        else if (req.user.dataValues.rola == 3) {
            res.redirect('/teacher');
        }
        else if (req.user.dataValues.rola == 4) {
            res.redirect('/administrator');
        }
    }
}

module.exports = { checkRole };