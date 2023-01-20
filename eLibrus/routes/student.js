var express = require("express");
var router = express.Router();
const moment = require("moment");
const sequelize = require("../models").sequelize;
const change_password = require("../helpers/change_pass");
const get_notifications = require("../helpers/get_notifications");
const { frekwencja, wiadomosc, uzytkownik } = require("../models");
const count_notif = require('../helpers/count_notifications');

/*
=================
STUDENT HOME PAGE
=================
*/

router.get("/", async function (req, res) {
    const [notes, meta] = await sequelize.query(`
        SELECT tytul, tresc FROM ogloszenia
        ORDER BY id DESC
	`);

    res.render("general/home", {
        user: req.user,
        notes,
        current_path: "student",
        count_notif: await count_notif(req.user.dataValues.user_id)
    });
});

/*
=================
STUDENT MESSAGES
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
	const messagesArrSent = await wiadomosc.findAll({
		where: {
			nadawca_id: user_id,
			typ: 1,
		}
	})
	const messagesDataReceived = [];
	for (const message of messagesArrReceived) {
		messagesDataReceived.push(message.dataValues);
	}
	const messagesDataSent = [];
	for (const message of messagesArrSent) {
		messagesDataSent.push(message.dataValues);
	}
	const usersDataRec = [];
	for (const data of messagesDataReceived) {
		const userData = await uzytkownik.findByPk(data.nadawca_id);
		usersDataRec.push([userData.imie, userData.nazwisko])
	}
	const usersDataSent = [];
	for (const data of messagesDataSent) {
		const userData = await uzytkownik.findByPk(data.odbiorca_id);
		usersDataSent.push([userData.imie, userData.nazwisko])
	}
	res.render('general/messages', {
		user: req.user,
		messagesRec: messagesDataReceived,
		messagesSent: messagesDataSent,
		usersNamesRec: usersDataRec,
		usersNamesSent: usersDataSent,
        current_path: 'messages',
        current_role: 'student',
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
		message: message,
		nadawca: nadawca,
        current_path: 'messages',
        current_role: 'student',
        count_notif: await count_notif(req.user.dataValues.user_id)
	});
});

router.get('/send_message', async function(req, res) {
	const nadawca_id = req.query.n;
	const [all_teachers] = await sequelize.query(`
        SELECT imie, nazwisko, email FROM uzytkownik
        WHERE rola = 3
    `);
    if (nadawca_id) {
		const nadawca = await uzytkownik.findByPk(nadawca_id);
		res.render('general/send_message', {
			user: req.user,
			nadawca_email: nadawca.email,
            current_path: 'messages',
            current_role: 'student',
            avilable_ppl: all_teachers,
            count_notif: await count_notif(req.user.dataValues.user_id)
		});
	} else {
		res.render('general/send_message', {
			user: req.user,
			nadawca_email: "",
            current_path: 'messages',
            current_role: 'student',
            avilable_ppl: all_teachers,
            count_notif: await count_notif(req.user.dataValues.user_id)
		});
	}
});

router.post('/send_message', async function(req, res) {
    const odbiorca = await uzytkownik.findOne({ where: { email: req.body["odbiorca"] } });
	if (!odbiorca) {
		req.flash('error', 'Brak użytkownika o podanym adresie email');
        res.redirect('/student/send_message');
    } else {
		var nowDate = new Date();
		var data = nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate();
        
        await sequelize.query(`
			INSERT INTO wiadomosc (nadawca_id, odbiorca_id, typ, data, tytul, tresc, odczytana, usunieta) VALUES
			(${req.user.dataValues.user_id}, ${odbiorca.user_id}, 1, "${data}", "${req.body["tytul"]}", "${req.body["tresc"]}", 0, 0)
		`);
		res.redirect('/student/messages');
	}
});

router.post('/delete_message', async function(req, res) {
    let to_delete = req.body.checkbox;

    if (!to_delete) res.redirect('/student/messages');
    else {
        if (typeof(to_delete) == 'string') to_delete = [to_delete];

        for(let i=0; i<to_delete.length; i++) {
            // zaznacz jako usunieta przy nadawcy
            await sequelize.query(`
                UPDATE wiadomosc
                SET usunieta = 1 
                WHERE usunieta = 0
                AND nadawca_id = ? AND wiadomosc_id = ?
            `, {
                replacements: [req.user.dataValues.user_id, to_delete[i]]
            });
            await sequelize.query(`
                DELETE FROM wiadomosc
                WHERE usunieta = 2 
                AND nadawca_id = ? AND wiadomosc_id = ?
            `, {
                replacements: [req.user.dataValues.user_id, to_delete[i]]
            });

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
        res.redirect('/student/messages');
    }
});

/*
=================
STUDENT NOTIFICATIONS
=================
*/

router.get("/notifications", async (req, res) => {
    const notifications = await get_notifications(req.user.dataValues.user_id);
    res.render("general/notifications", {
        user: req.user,
        current_path: "notifications",
        notifications,
        count_notif: await count_notif(req.user.dataValues.user_id)
    });
});

router.post("/notifications", async (req, res) => {
    let { note_id, operation } = req.body;
    console.log(req.body);
    if (!note_id || !operation) res.redirect("/student/notifications");
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
        res.redirect("/student/notifications");
    }
});

/*
=================
STUDENT CHANGE PASSWORD
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

    res.redirect("/student/change_password");
});

/*
=================
STUDENT ATTENDANCE
=================
*/

router.get("/attendance", async function (req, res) {
    let week = req.query.attendance_date;
    const user_id = req.user.dataValues.user_id;
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
    let notif = await count_notif(req.user.dataValues.user_id)
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
        res.render("student/attendance", {
            user: req.user,
            current_path: "attendance",
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

/*
=================
STUDENT GRADES
=================
*/

router.get("/grades", async function (req, res) {
    const [przedmioty, metadata_przedmioty] = await sequelize.query(
        `SELECT zajecia_id, przedmioty.nazwa FROM zajecia 
		NATURAL JOIN uzytkownik NATURAL JOIN przedmioty 
		WHERE user_id = ?`,
        { replacements: [req.user.dataValues.user_id] }
    );

    const [oceny, metadata_oceny] = await sequelize.query(
        `
        SELECT zajecia_id, ocena FROM oceny 
		NATURAL JOIN zajecia NATURAL JOIN uzytkownik 
		WHERE user_id = ?`,
        { replacements: [req.user.dataValues.user_id] }
    );

    console.log(przedmioty, oceny);
    let grades = {};
    przedmioty.forEach((przedmiot) => {
        if (grades[`${przedmiot.nazwa}`] == undefined)
            grades[`${przedmiot.nazwa}`] = [];
        oceny.forEach((ocena) => {
            if (przedmiot.zajecia_id == ocena.zajecia_id) {
                grades[`${przedmiot.nazwa}`].push(ocena.ocena);
            }
        });
    });
    res.render("student/grades", {
        user: req.user,
        grades,
        current_path: "grades",
        count_notif: await count_notif(req.user.dataValues.user_id)
    });
});

/*
=================
STUDENT SCHEDULE
=================
*/

router.get("/schedule", async function (req, res) {
    const [result, metadata] = await sequelize.query(
        `
        SELECT nazwa, dzien, nr_lekcji FROM zajecia 
        NATURAL JOIN data_zajec NATURAL JOIN przedmioty NATURAL JOIN uzytkownik 
        WHERE user_id = ?`,
        { replacements: [req.user.dataValues.user_id] }
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

    res.render("student/schedule", {
        user: req.user,
        students: req.students,
        current_student: req.user.user_id,
        schedule,
        current_path: "schedule",
        count_notif: await count_notif(req.user.dataValues.user_id)
    });
});

/*
=================
STUDENT HOMEWORK
=================
*/

router.get("/homeworks", async function (req, res) {
    const [homeworks, metadata] = await sequelize.query(
        `
        SELECT prowadzacy.imie, prowadzacy.nazwisko, termin_oddania, tytul, opis, przedmioty.nazwa FROM zadanie_domowe 
        NATURAL JOIN zajecia NATURAL JOIN przedmioty NATURAL JOIN uzytkownik AS uczen inner join uzytkownik AS prowadzacy 
        ON prowadzacy.user_id = prowadzacy_id 
        WHERE uczen.user_id = ?`,
        { replacements: [req.user.dataValues.user_id] }
    );

    res.render("student/homeworks", {
        user: req.user,
        students: req.students,
        current_student: req.user.user_id,
        homeworks,
        current_path: "homeworks",
        count_notif: await count_notif(req.user.dataValues.user_id)
    });
});

module.exports = router;
