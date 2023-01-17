var express = require("express");
var router = express.Router();
const moment = require("moment");
const sequelize = require("../models").sequelize;

const {
    uzytkownik,
    klasa,
    zajecia,
    przedmioty,
    frekwencja,
} = require("../models");

// student home page
router.get("/", async function (req, res) {
    const [notes, meta] = await sequelize.query(`
		SELECT tytul, tresc FROM ogloszenia;
	`);
    res.render("general/home", { user: req.user, notes });
});

router.get("/attendance", async function (req, res) {
    let week = req.query.attendance_date;
    const user_id = req.user.dataValues.user_id;
    if (typeof week == "undefined") {
        week = moment().week();
        week = `${moment().year()}-W${week < 10 ? `0${week}` : week}`;
    }
    day_names = ["Poniedzialek", "Wtorek", "Sroda", "Czwartek", "Piatek"];
    const start = moment(week, "GGGG-[W]WW").startOf("week").add(1, "day").format();
    const end = moment(week, "GGGG-[W]WW").endOf("week").subtract(1, "day").format();
    const dates = [];
    let currentDate = moment(start);
    while (currentDate.isBefore(end)) {
        dates.push(currentDate.format("YYYY-MM-DD"));
        currentDate = moment(currentDate).add(1, "day");
    }
    let promiseArr = [];
    for (const date of dates) {
        promiseArr.push(
            frekwencja.findAll({
                where: {
                    data_zajec: date,
                    user_id: user_id,
                },
            })
        );
    }
    let attendanceData = await Promise.all(promiseArr);
    let days = {};
    Promise.all(
        attendanceData.map((attendance, i) => {
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
                    if (obj.frekwencja === "U") acc.U++;
                    return acc;
                },
                { O: 0, N: 0, S: 0, Z: 0, U: 0 }
            );
            days[dates[i]] = {
                date: dates[i],
                day_name: day_names[i],
                attendance: full_attendance,
                stats: count,
            };
        })
    ).then(() => {
        console.log(week);
        res.render("student/attendance", {
            week: week,
            days: days,
            user: req.user,
        });
    });
});

// student grades
router.get("/grades", async function (req, res) {
    const [przedmioty, metadata_przedmioty] = await sequelize.query(
		`SELECT zajecia_id, przedmioty.nazwa FROM zajecia 
		NATURAL JOIN uzytkownik NATURAL JOIN przedmioty 
		WHERE user_id = ${req.user.dataValues.user_id}`
	);

    
	const [oceny, metadata_oceny] = await sequelize.query(`
        SELECT zajecia_id, ocena FROM oceny 
		NATURAL JOIN zajecia NATURAL JOIN uzytkownik 
		WHERE user_id = ${req.user.dataValues.user_id}
    `);
        
    console.log(przedmioty, oceny);
	let grades = {};
	przedmioty.forEach(przedmiot => {
		if (grades[`${przedmiot.nazwa}`] == undefined) grades[`${przedmiot.nazwa}`] = [];
		oceny.forEach(ocena => {
			if (przedmiot.zajecia_id == ocena.zajecia_id) {
				grades[`${przedmiot.nazwa}`].push(ocena.ocena);
			}
		});
	});
    res.render("student/grades", { user: req.user, grades });
});

// student schedule
router.get("/schedule", async function (req, res) {
    const [result, metadata] = await sequelize.query(`
        SELECT nazwa, dzien, nr_lekcji FROM zajecia 
        NATURAL JOIN data_zajec NATURAL JOIN przedmioty NATURAL JOIN uzytkownik 
        WHERE user_id = ${req.user.user_id}
        `);

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

    res.render("student/schedule", {
        user: req.user,
        students: req.students,
        current_student: req.user.user_id,
        schedule,
    });
});

// student homeworks
router.get("/homeworks", async function (req, res) {
    const [homeworks, metadata] = await sequelize.query(`
        SELECT prowadzacy.imie, prowadzacy.nazwisko, termin_oddania, tytul, opis, przedmioty.nazwa FROM zadanie_domowe 
        NATURAL JOIN zajecia NATURAL JOIN przedmioty NATURAL JOIN uzytkownik AS uczen inner join uzytkownik AS prowadzacy 
        ON prowadzacy.user_id = prowadzacy_id 
        WHERE uczen.user_id = ${req.user.user_id}
    `);

    res.render("student/homeworks", {
        user: req.user,
        students: req.students,
        current_student: req.user.user_id,
        homeworks,
    });
});

module.exports = router;
