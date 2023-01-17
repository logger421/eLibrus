var express = require("express");
var router = express.Router();
const sequelize = require("../models").sequelize;

const { getClass, getSubject } = require("../helpers/teacher_classes_subjects");
const {
    uzytkownik,
    klasa,
    zajecia,
    przedmioty,
    frekwencja,
    data_zajec
} = require("../models");

// teacher home page
router.get("/", function (req, res) {
    res.render("general/home", { user: req.user });
});

// teacher attendance
router.get("/attendance", async function (req, res) {
    const classes = await getClass(req.user.dataValues.user_id);
    let class_id = req.query.class_id;
    if (typeof class_id == "undefined") {
        class_id = classes[0].klasa_id;
    }
    const subjects = await getSubject(req.user.dataValues.user_id, class_id);
    const temp = new Set();

    let selectedDate = req.query.attendance_date;
    if (typeof selectedDate == "undefined") {
        let current_day = new Date();
        selectedDate = current_day.toISOString().split("T")[0];
    }
    let date = new Date(selectedDate);
    let day = ["Poniedzialek", "Wtorek", "Sroda", "Czwartek", "Piatek", "Sobota", "Niedziela"][date.getUTCDay()]

    // const classes_numbers = await zajecia.findAll({
    //     include: [
    //         {
    //             model: data_zajec,
    //             where: { klasa_id: class_id, dzien: day },
    //         },
    //     ],
    // });


    const [classes_numbers, metadata] = await sequelize.query(
        `SELECT * FROM zajecia NATURAL JOIN data_zajec WHERE klasa_id=${class_id} AND dzien="${day}"`
    );

    const filteredSubjects = subjects.filter((el) => {
        const duplicate = temp.has(el.nazwa);
        temp.add(el.nazwa);
        return !duplicate;
    });

    students = await uzytkownik.findAll({
        where: {
            klasa_id: class_id,
        },
    });

    res.render("teacher/attendance", {
        user: req.user,
        class_id: class_id,
        subjects: filteredSubjects,
        classes: classes,
        students: students,
        date: selectedDate,
        classes_numbers: classes_numbers
    });
});

router.post("/attendance", (req, res) => {
    console.log(req.body)
    res.redirect("/teacher/attendance")
})

// teacher grades
router.get("/grades", function (req, res) {
    res.render("teacher/grades", { user: req.user });
});

// teacher schedule
router.get("/schedule", async function (req, res) {
    const [result, metadata] = await sequelize.query(
        `SELECT nr_lekcji, dzien, przedmioty.nazwa FROM zajecia 
        NATURAL JOIN uzytkownik NATURAL JOIN przedmioty WHERE prowadzacy_id = ${req.user.user_id}`
    );

    let dni = ["Poniedzialek", "Wtorek", "Sroda", "Czwartek", "Piatek"];
    let schedule = {
        1: ["", "", "", "", ""],
        2: ["", "", "", "", ""],
        3: ["", "", "", "", ""],
        4: ["", "", "", "", ""],
        5: ["", "", "", "", ""],
        6: ["", "", "", "", ""],
        7: ["", "", "", "", ""],
        8: ["", "", "", "", ""],
    };

    for (var i = 0; i < 5; i++) {
        for (var j = 1; j < 9; j++) {
            result.forEach((element) => {
                if (element.dzien == dni[i] && element.nr_lekcji == j) {
                    schedule[j][i] = element.nazwa;
                }
            });
        }
    }

    res.render("teacher/schedule", {
        user: req.user,
        students: req.students,
        current_student: req.user.user_id,
        schedule,
    });
});

// teacher homeworks
router.get("/homeworks", async function (req, res) {
    const classes = await getClass(req.user.dataValues.user_id);
    const subjects = await getSubject(req.user.dataValues.user_id, 1);
    const temp = new Set();

    const filteredSubjects = subjects.filter((el) => {
        const duplicate = temp.has(el.nazwa);
        temp.add(el.nazwa);
        return !duplicate;
    });

    res.render("teacher/homeworks", {
        user: req.user,
        subjects: filteredSubjects,
        classes,
    });
});

router.post("/homeworks", async function (req, res) {
    console.log(req.body);
    res.redirect("/teacher/homeworks");
});

module.exports = router;
