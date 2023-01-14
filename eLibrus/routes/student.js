var express = require("express");
var router = express.Router();

const {
    uzytkownik,
    klasa,
    zajecia,
    przedmioty,
    frekwencja,
} = require("../models");

// student home page
router.get("/", async function (req, res) {
    let result = await uzytkownik.findAll({
        include: [
            {
                model: zajecia,
                required: true,
            },
        ],
    });
    console.log(result[0].dataValues);
    res.render("general/home", { user: req.user });
});

// student attendance
router.get("/attendance", function (req, res) {
    // const selectedDate = "2023-01-03";
    let selectedDate = req.query.data;
    if (typeof selectedDate == 'undefined')
        selectedDate = '2023-01-03'
    const user_id = req.user.dataValues.user_id
    console.log(selectedDate)
    frekwencja
        .findAll({
            where: {
                data_zajec: selectedDate,
                user_id: user_id,
            },
        })
        .then((attendance) => {
            let template_attendance = Array.from({ length: 8 }, (_, i) => ({
                id: i + 1,
                zajecia_id: 0,
                user_id: user_id,
                frekwencja: "-",
            }));
            let full_attendance = template_attendance.map((obj) => {
                let attendanceObj = attendance.find(
                    (item) => item.id === obj.id
                );
                return attendanceObj ? attendanceObj : obj;
            });
            let count = full_attendance.reduce(
                (acc, obj) => {
                    if (obj.frekwencja === "O") acc.O++;
                    if (obj.frekwencja === "N") acc.N++;
                    if (obj.frekwencja === "S") acc.S++;
                    if (obj.frekwencja === "Z") acc.Z++;
                    return acc;
                },
                { O: 0, N: 0, S: 0, Z: 0 }
            );
            res.render("student/attendance", {
                user: req.user,
                attendance: full_attendance,
                stats: count
            });
        });
});

// student grades
router.get("/grades", function (req, res) {
    res.render("student/grades", { user: req.user });
});

// student schedule
router.get("/schedule", function (req, res) {
    res.render("student/schedule", { user: req.user });
});

// student homeworks
router.get("/homeworks", function (req, res) {
    res.render("student/homeworks", { user: req.user });
});

module.exports = router;