var express = require("express");
var router = express.Router();
const moment = require("moment");
const change_password = require("../helpers/change_pass");
const sequelize = require("../models").sequelize;
const get_notifications = require("../helpers/get_notifications");
const { notification_teacher } = require("../helpers/create_notification");
const { frekwencja, wiadomosc, uzytkownik } = require("../models");
const count_notif = require('../helpers/count_notifications');

/*
=================
PARENT MIDDLEWARE FOR CURRENT STUDENT
=================
*/

router.get("*", async function (req, res, next) {
    const [result, metadata] = await sequelize.query(
        `SELECT uczen.user_id, uczen.imie, uczen.nazwisko FROM rodzicielstwo 
		JOIN uzytkownik AS rodzic JOIN uzytkownik AS uczen 
		ON rodzic.user_id = rodzicielstwo.rodzic_id AND uczen.user_id = rodzicielstwo.dziecko_id
        WHERE rodzic.user_id = ?
        `, {
            replacements: [req.user.dataValues.user_id]
        }
    );
    if (!req.cookies.current_student) {
        if (result.length > 0) res.cookie("current_student", result[0].user_id);
        else res.cookie("current_student", 0);
    }
    req.students = result;

    next();
});

/*
=================
PARENT HOME PAGE
=================
*/

router.get("/", async function (req, res) {
    const [notes, meta] = await sequelize.query(`
		SELECT tytul, tresc FROM ogloszenia
		ORDER BY id DESC
	`);
    res.render("general/home", {
        user: req.user,
        students: req.students,
        current_student: req.cookies.current_student,
        notes,
        current_path: "parent",
        count_notif: await count_notif(req.user.dataValues.user_id)
    });
});


/*
=================
TEACHER MESSAGES
=================
*/

router.get('/messages', async (req, res) => {
    const user_id = req.user.dataValues.user_id;
	const messagesArrReceived = await wiadomosc.findAll({
		where: {
			odbiorca_id: user_id,
			typ: 1,
		}
	})

	const messagesDataReceived = [];
	for (const message of messagesArrReceived) {
		messagesDataReceived.push(message.dataValues);
	}

	const usersDataRec = [];
	for (const data of messagesDataReceived) {
		const userData = await uzytkownik.findByPk(data.nadawca_id);
		usersDataRec.push([userData.imie, userData.nazwisko])
	}

	res.render('general/messages', {
		user: req.user,
        students: req.students,
        current_student: req.cookies.current_student,
		messagesRec: messagesDataReceived,
		usersNamesRec: usersDataRec,
        current_path: 'messages',
        current_role: 'parent',
        count_notif: await count_notif(req.user.dataValues.user_id)
	});
});

router.get('/read_message', async function(req, res) {
	const message_id = req.query.message_id;
	const message = await wiadomosc.findByPk(message_id);
	const nadawca = await uzytkownik.findByPk(message.nadawca_id);
	sequelize.query(`UPDATE wiadomosc SET odczytana=1 WHERE wiadomosc_id= ?`, {
        replacements: [message_id]
    });
	res.render('general/read_message', {
		user: req.user,
        students: req.students,
        current_student: req.cookies.current_student,
		message: message,
		nadawca: nadawca,
        current_path: 'messages',
        current_role: 'parent',
        count_notif: await count_notif(req.user.dataValues.user_id)
	});
});

router.post('/delete_message', async function(req, res) {
    let to_delete = req.body.checkbox;
    if (!to_delete) res.redirect('/parent/messages');
    else {
        if (typeof(to_delete) == 'string') to_delete = [to_delete];
        
        for(let i=0; i<to_delete.length; i++) {
            // ODBIORCA
            await sequelize.query(`
                UPDATE wiadomosc
                SET usunieta = 2 
                WHERE usunieta = 0
                AND odbiorca_id = ? AND wiadomosc_id = ?
            `, {
                replacements: [req.user.dataValues.user_id, to_delete[i]]
            });
            await sequelize.query(`
                DELETE FROM wiadomosc
                WHERE usunieta = 1 
                AND odbiorca_id = ? AND wiadomosc_id = ?
            `, {
                replacements: [req.user.dataValues.user_id, to_delete[i]]
            });
        }
        res.redirect('/parent/messages');
    }
});

/*
=================
PARENT NOTIFICATIONS
=================
*/

router.get("/notifications", async (req, res) => {
    const notifications = await get_notifications(req.user.dataValues.user_id);
    res.render("general/notifications", {
        user: req.user,
        notifications,
        current_path: "notifications",
        count_notif: await count_notif(req.user.dataValues.user_id)
    });
});

router.post("/notifications", async (req, res) => {
    let { note_id, operation } = req.body;
    console.log(req.body);
    if (!note_id || !operation) res.redirect("/parent/notifications");
    else {
        if (typeof note_id == "string") note_id = [note_id];
        if (operation == "read") {
            for (let i = 0; i < note_id.length; i++) {
                await sequelize.query(
                    `
                    UPDATE wiadomosc 
                    SET odczytana = 1 
                    WHERE wiadomosc_id = ?
                `,
                    {
                        replacements: [note_id[i]],
                    }
                );
            }
        } else if (operation == "delete") {
            for (let i = 0; i < note_id.length; i++) {
                await sequelize.query(
                    `
                    DELETE FROM wiadomosc 
                    WHERE wiadomosc_id = ?
                `,
                    {
                        replacements: [note_id[i]],
                    }
                );
            }
        }
        res.redirect("/parent/notifications");
    }
});

/*
=================
PARENT CHANGE PASSWORD
=================
*/

router.get("/change_password", async (req, res) => {
    res.render("general/change_password", {
        user: req.user,
        current_path: "change_password",
        count_notif: await count_notif(req.user.dataValues.user_id)
    });
});

router.post("/change_password", async (req, res) => {
    const { old_pass, new_pass, new_pass_again } = req.body;

    const result = await change_password(
        req.user.dataValues.user_id,
        old_pass,
        new_pass,
        new_pass_again
    );

    if (result[0] == 0) {
        for (let i = 0; i < result[1].length; i++)
            req.flash("error", result[1][i]);
    } else {
        req.flash("success_message", result[1][0]);
    }

    res.redirect("/parent/change_password");
});

/*
=================
PARENT ATTENDANCE
=================
*/

router.get("/attendance", async function (req, res) {
    let week = req.query.attendance_date;
    const user_id = req.cookies.current_student;
    if (typeof week == "undefined") {
        week = moment().week();
        week = `${moment().year()}-W${week < 10 ? `0${week}` : week}`;
    }
    day_names = ["Poniedzialek", "Wtorek", "Sroda", "Czwartek", "Piatek"];
    const start = moment(week, "GGGG-[W]WW")
        .startOf("week")
        .add(1, "day")
        .format();
    const end = moment(week, "GGGG-[W]WW")
        .endOf("week")
        .subtract(1, "day")
        .format();
    const dates = [];
    let currentDate = moment(start);
    while (currentDate.isBefore(end)) {
        dates.push(currentDate.format("YYYY-MM-DD"));
        currentDate = moment(currentDate).add(1, "day");
    }

    const [all_attendance] = await sequelize.query(
        `SELECT * FROM frekwencja WHERE user_id=?`,
        {
            replacements: [user_id],
        }
    );

    let full_attendance = all_attendance.reduce(
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
    let notif = await count_notif(req.user.dataValues.user_id);
    Promise.all(
        attendanceData.map((attendance, i) => {
            let template_attendance = Array.from({ length: 8 }, (_, i) => ({
                nr_lekcji: i + 1,
                zajecia_id: 0,
                user_id: user_id,
                frekwencja: "-",
            }));
            let full_attendance = template_attendance.map((obj) => {
                let attendanceObj = attendance.find(
                    (item) => item.nr_lekcji === obj.nr_lekcji
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
        res.render("parent/attendance", {
            user: req.user,
            current_path: "attendance",
            current_student: req.cookies.current_student,
            students: req.students,
            week: week,
            days: days,
            full_attendance: full_attendance,
            frekwencja_percentage: (
                (100 * (full_attendance.O + full_attendance.U)) /
                Object.values(full_attendance).reduce((a, b) => a + b)
            ).toFixed(2),
            count_notif: notif
        });
    });
});

router.post("/justify_attendance", async function (req, res) {
    let changed = 0;
    let justify;
    if (req.body["justify"]) {
        if (typeof req.body["justify"] == "string") {
            justify = [req.body["justify"]];
        }
        else {
            justify = req.body["justify"];
        }
        for (var i = 0; i < justify.length; i++) {
            await sequelize.query(`
					UPDATE frekwencja SET frekwencja = 'U' 
					WHERE frekwencja = 'N' AND user_id = ? AND data_zajec = ?
				`, {
                    replacements: [req.cookies.current_student, justify[i]]
                });
            changed = 1;
        }
    }

    if (changed) {
        notification_teacher(req.cookies.current_student);
    }

    res.redirect(
        `/parent/attendance/?attendance_date=${req.body["redirect_to_attendance_date"]}`
    );
});

/*
=================
PARENT GRADES
=================
*/

router.get("/grades", async function (req, res) {
    const [classses, metadata_przedmioty] = await sequelize.query(
        `SELECT zajecia_id, przedmioty.nazwa FROM zajecia 
		NATURAL JOIN uzytkownik NATURAL JOIN przedmioty 
		WHERE user_id = ?`,
        { replacements: [req.cookies.current_student] }
    );

    const [all_grades, metadata_oceny] = await sequelize.query(
        `SELECT zajecia_id, ocena FROM oceny 
		NATURAL JOIN zajecia NATURAL JOIN uzytkownik 
		WHERE user_id = ?`,
        { replacements: [req.cookies.current_student] }
    );

    let grades = {};
    classses.forEach((przedmiot) => {
        if (grades[`${przedmiot.nazwa}`] == undefined)
            grades[`${przedmiot.nazwa}`] = { oceny: [], avg: 0 };
        all_grades.forEach((ocena) => {
            if (przedmiot.zajecia_id == ocena.zajecia_id) {
                grades[`${przedmiot.nazwa}`]["oceny"].push(ocena.ocena);
                grades[`${przedmiot.nazwa}`]["avg"] += ocena.ocena;
            }
        });
    });

    res.render("parent/grades", {
        user: req.user,
        students: req.students,
        current_student: req.cookies.current_student,
        grades,
        current_path: "grades",
        count_notif: await count_notif(req.user.dataValues.user_id)
    });
});

/*
=================
PARENT SCHEDULE
=================
*/

router.get("/schedule", async function (req, res) {
    const [result, metadata] = await sequelize.query(
        `
        SELECT nazwa, dzien, nr_lekcji FROM zajecia 
        NATURAL JOIN data_zajec NATURAL JOIN przedmioty NATURAL JOIN uzytkownik 
        WHERE user_id = ?`,
        { replacements: [req.cookies.current_student] }
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

    res.render("parent/schedule", {
        user: req.user,
        students: req.students,
        current_student: req.cookies.current_student,
        schedule,
        current_path: "schedule",
        count_notif: await count_notif(req.user.dataValues.user_id)
    });
});

/*
=================
PARENT HOMEWORK
=================
*/

router.get("/homeworks", async function (req, res) {
    const [homeworks, metadata] = await sequelize.query(
        `
		SELECT prowadzacy.imie, prowadzacy.nazwisko, termin_oddania, tytul, opis, przedmioty.nazwa FROM zadanie_domowe 
		NATURAL JOIN zajecia NATURAL JOIN przedmioty NATURAL JOIN uzytkownik AS uczen inner join uzytkownik AS prowadzacy 
		ON prowadzacy.user_id = prowadzacy_id where uczen.user_id = ?`,
        { replacements: [req.cookies.current_student] }
    );

    res.render("parent/homeworks", {
        user: req.user,
        students: req.students,
        current_student: req.cookies.current_student,
        homeworks,
        current_path: "homeworks",
        count_notif: await count_notif(req.user.dataValues.user_id)
    });
});

/*
=================
PARENT CHANGE CURRENT STUDENT
=================
*/

router.post("/change_student", function (req, res) {
    res.cookie("current_student", req.body.selected_student);
    res.redirect("/");
});


module.exports = router;
