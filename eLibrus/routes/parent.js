var express = require('express');
var router = express.Router();
const moment = require("moment");

const sequelize = require('../models').sequelize;

const {
    uzytkownik,
    klasa,
    zajecia,
    przedmioty,
    frekwencja,
} = require("../models");

router.get('*', async function (req, res, next) {
	const [result, metadata] = await sequelize.query(
		`SELECT uczen.user_id, uczen.imie, uczen.nazwisko FROM rodzicielstwo 
		JOIN uzytkownik AS rodzic JOIN uzytkownik AS uczen 
		ON rodzic.user_id = rodzicielstwo.rodzic_id AND uczen.user_id = rodzicielstwo.dziecko_id`
	);
	if (!req.cookies.current_student)
		res.cookie('current_student', result[0].user_id);
	req.students = result;
	
	next();
});

// parent home page
router.get('/', async function(req, res) {
	res.render('general/home', { user: req.user, students: req.students, current_student: req.cookies.current_student});
});

// parent attendance
router.get('/attendance', async function(req, res) {
	let week = req.query.attendance_date;
    const user_id = req.cookies.current_student;
    if (typeof week == "undefined") {
        week = moment().week();
        week = `${moment().year()}-W${week < 10 ? `0${week}` : week}`;
    }
    const start = moment(week, "GGGG-[W]WW").startOf("week").format();
    const end = moment(week, "GGGG-[W]WW").endOf("week").format();
    const dates = [];
    let currentDate = moment(start);
    while (currentDate.isBefore(end)) {
        dates.push(currentDate.format("YYYY-MM-DD"));
        currentDate = moment(currentDate).add(1, "day");
    }
    console.log(`THERE IS THE WEEK: ${dates}`);
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
                attendance: full_attendance,
                stats: count,
            };
        })
    ).then(() => {
		res.render('parent/attendance', { user: req.user, students: req.students, current_student: req.cookies.current_student, week, days});
    });
});

// parent grades
router.get('/grades', async function(req, res) {
	const [classses, metadata_przedmioty] = await sequelize.query(
		`SELECT zajecia_id, przedmioty.nazwa FROM zajecia 
		NATURAL JOIN uzytkownik NATURAL JOIN przedmioty 
		WHERE user_id = ${req.cookies.current_student}`
	);

	const [all_grades, metadata_oceny] = await sequelize.query(
		`SELECT zajecia_id, ocena FROM oceny 
		NATURAL JOIN zajecia NATURAL JOIN uzytkownik 
		WHERE user_id = ${req.cookies.current_student}`
	);

	let grades = {};
	classses.forEach(przedmiot => {
		if (grades[`${przedmiot.nazwa}`] == undefined) grades[`${przedmiot.nazwa}`] = {"oceny": [], "avg": 0};
		all_grades.forEach(ocena => {
			if (przedmiot.zajecia_id == ocena.zajecia_id) {
				grades[`${przedmiot.nazwa}`]['oceny'].push(ocena.ocena);
				grades[`${przedmiot.nazwa}`]['avg'] += ocena.ocena;
			}
		});
	});

	res.render('parent/grades', { user: req.user, students: req.students, current_student: req.cookies.current_student, grades});
});

// parent schedule
router.get('/schedule', async function(req, res) {
	const [result, metadata] = await sequelize.query(
		`SELECT nr_lekcji, dzien, przedmioty.nazwa FROM zajecia 
		NATURAL JOIN uzytkownik NATURAL JOIN przedmioty WHERE user_id = ${req.cookies.current_student}`
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

	for (var i=0; i<5; i++) {
		for(var j=1; j<9; j++) {
			result.forEach(element => {
				if (element.dzien == dni[i] && element.nr_lekcji == j) {
					schedule[j][i] = element.nazwa;
				}
			});
		}
	}

	res.render('parent/schedule', { user: req.user, students: req.students, current_student: req.cookies.current_student, schedule});
});

// parent homeworks
router.get('/homeworks', async function(req, res) {
	const [homeworks, metadata] = await sequelize.query(`
		SELECT prowadzacy.imie, prowadzacy.nazwisko, termin_oddania, tytul, opis, przedmioty.nazwa FROM zadanie_domowe 
		NATURAL JOIN zajecia NATURAL JOIN przedmioty NATURAL JOIN uzytkownik AS uczen inner join uzytkownik AS prowadzacy 
		ON prowadzacy.user_id = prowadzacy_id where uczen.user_id = ${req.cookies.current_student}`
	);
	
	res.render('parent/homeworks', { user: req.user, students: req.students, current_student: req.cookies.current_student, homeworks});
});

router.post('/change_student', function(req, res) {
	res.cookie('current_student', req.body.selected_student);
	res.redirect('/');
});

router.post('/justify_attendance', async function(req, res) {


	if (req.body['justify']) {
		if (typeof(req.body['justify']) == 'string') {
			console.log(1, " : ", req.body['justify']);
			await sequelize.query(`
				UPDATE frekwencja SET frekwencja = 'U' 
				WHERE frekwencja = 'N' AND user_id = ${req.cookies.current_student} AND data_zajec = '${req.body['justify']}'
			`);
		}
		else {
			for(var i=0; i<req.body['justify'].length; i++) {
				await sequelize.query(`
					UPDATE frekwencja SET frekwencja = 'U' 
					WHERE frekwencja = 'N' AND user_id = ${req.cookies.current_student} AND data_zajec = '${req.body['justify'][i]}'
				`);
			}
		}
	}

	res.redirect(`/parent/attendance/?attendance_date=${req.body['redirect_to_attendance_date']}`);
});

module.exports = router;
