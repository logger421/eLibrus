var express = require('express');

const isStudent = (req, res, next) => {
    if (!req.user) res.redirect('/');
    else if (req.user.dataValues.rola == 1) {
        next();
    }
    else {
        res.redirect('/');
    }
};

const isParent = (req, res, next) => {
    if (!req.user) res.redirect('/');
    else if (req.user.dataValues.rola == 2) {
        next();
    }
    else {
        res.redirect('/');
    }
};

const isTeacher = (req, res, next) => {
    if (!req.user) res.redirect('/');
    else if (req.user.dataValues.rola == 3) {
        next();
    }
    else {
        res.redirect('/');
    }
};

const isAdmin = (req, res, next) => {
    if (!req.user) res.redirect('/');
    else if (req.user.dataValues.rola == 4) {
        next();
    }
    else {
        res.redirect('/');
    }
};

const redirectWithRole = (req, res) => {
    if (!req.user) res.redirect('/home');
    else if (req.user.dataValues.rola == 1) res.redirect('/student');
    else if (req.user.dataValues.rola == 2) res.redirect('/parent');
    else if (req.user.dataValues.rola == 3) res.redirect('/teacher');
    else if (req.user.dataValues.rola == 4) res.redirect('/admin');
}

module.exports = { isStudent, isParent, isTeacher, isAdmin, redirectWithRole };