var express = require("express");
var router = express.Router();
const sequelize = require("../models").sequelize;
const querystring = require('querystring');    
const change_password = require("../helpers/change_pass");
const { getClass, getSubject } = require("../helpers/teacher_classes_subjects");
const { notification_student, notification_class } = require("../helpers/create_notification");
const get_notifications = require("../helpers/get_notifications");
const { frekwencja, wiadomosc, uzytkownik } = require("../models");
const count_notif = require('../helpers/count_notifications');

/*
=================
TEACHER HOME PAGE
=================
*/

router.get("/", async function (req, res) {
    const [notes, meta] = await sequelize.query(`
        SELECT tytul, tresc FROM ogloszenia
        ORDER BY id DESC
	`);
    res.render("general/home", { user: req.user, notes, current_path: 'teacher', count_notif: await count_notif(req.user.dataValues.user_id) });
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
        current_role: 'teacher',
        count_notif: await count_notif(req.user.dataValues.user_id)
	});
});

router.get('/read_message', async function(req, res) {
	const message_id = req.query.message_id;
	const message = await wiadomosc.findByPk(message_id);
	const nadawca = await uzytkownik.findByPk(message.nadawca_id);
	sequelize.query(`UPDATE wiadomosc SET odczytana=1 WHERE wiadomosc_id= ?`,{
        replacements: [message_id]
    });
	res.render('general/read_message', {
		user: req.user,
		message: message,
		nadawca: nadawca,
        current_path: 'messages',
        current_role: 'teacher',
        count_notif: await count_notif(req.user.dataValues.user_id)
	});
});

router.get('/send_message', async function(req, res) {
	const nadawca_id = req.query.n;
	
    const [all_students_and_parents] = await sequelize.query(`
        SELECT imie, nazwisko, email FROM uzytkownik
        WHERE rola = 1 OR rola = 2
    `);
    
    if (nadawca_id) {
		const nadawca = await uzytkownik.findByPk(nadawca_id);
		res.render("general/send_message", {
            user: req.user,
            nadawca_email: nadawca.email,
            current_path: "messages",
            current_role: "teacher",
            avilable_ppl: all_students_and_parents,
            count_notif: await count_notif(req.user.dataValues.user_id),
        });
	} else {
		res.render('general/send_message', {
			user: req.user,
			nadawca_email: "",
            current_path: 'messages',
            current_role: 'teacher',
            avilable_ppl: all_students_and_parents,
            count_notif: await count_notif(req.user.dataValues.user_id)
		});
	}
});

router.post('/send_message', async function(req, res) {
	const odbiorca = await uzytkownik.findOne({ where: { email: req.body["odbiorca"] } });
	if (!odbiorca) {
		req.flash('error', 'Brak użytkownika o podanym adresie email');
        res.redirect('/teacher/send_message');
    } else {
		var nowDate = new Date();
		var data = nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate();
        
        await sequelize.query(`
			INSERT INTO wiadomosc (nadawca_id, odbiorca_id, typ, data, tytul, tresc, odczytana, usunieta) VALUES
			(?, ?, 1, ?, ?, ?, 0, 0)
		`,{
            replacements: [req.user.dataValues.user_id, odbiorca.user_id, data, req.body["tytul"], req.body["tresc"]]
        });
		res.redirect('/teacher/messages');
	}
});

router.post('/delete_message', async function(req, res) {
    let to_delete = req.body.checkbox;
    console.log(to_delete);
    if (!to_delete) res.redirect('/teacher/messages');
    else {
         if (typeof(to_delete) == 'string') to_delete = [to_delete];
        
        for(let i=0; i<to_delete.length; i++) {
            // NADAWCA
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
        res.redirect('/teacher/messages');
    }
});

/*
=================
TEACHER NOTIFICATIONS 
=================
*/

router.get('/notifications', async (req, res) => {
    const notifications = await get_notifications(req.user.dataValues.user_id);
    res.render('general/notifications', { user: req.user, notifications,  current_path: 'notifications', count_notif: await count_notif(req.user.dataValues.user_id) })
});

router.post('/notifications', async (req, res) => {
    let { note_id, operation } = req.body;
    console.log(req.body);
    if (!note_id || !operation) res.redirect('/teacher/notifications');
    else {
        if (typeof(note_id) == 'string') note_id = [note_id];
        if (operation == 'read') {
            for(let i=0; i<note_id.length; i++) {
                await sequelize.query(`
                    UPDATE wiadomosc 
                    SET odczytana = 1 
                    WHERE wiadomosc_id = ?
                `, {
                    replacements: [note_id[i]]
                });
            }
        }
        else if (operation == 'delete') {
            for(let i=0; i<note_id.length; i++) {
                await sequelize.query(`
                    DELETE FROM wiadomosc 
                    WHERE wiadomosc_id = ?
                `, {
                    replacements: [note_id[i]]
                });
            }
        }
        res.redirect('/teacher/notifications');
    }
});

/*
=================
TEACHER CHANGE PASSWORD 
=================
*/

router.get('/change_password', async (req, res) => {
    res.render("general/change_password", {user: req.user, current_path: 'change_password', count_notif: await count_notif(req.user.dataValues.user_id)});
});

router.post('/change_password', async (req, res) => {
    const { old_pass, new_pass, new_pass_again } = req.body;

    const result = await change_password(req.user.dataValues.user_id, old_pass, new_pass, new_pass_again);

    if (result[0] == 0) {
        for(let i=0; i<result[1].length; i++) 
            req.flash('error', result[1][i]);
    }
    else {
        req.flash('success_message', result[1][0]);
    }

    res.redirect('/teacher/change_password');
});

/*
=================
TEACHER ATTENDANCE 
=================
*/

router.get("/attendance", async function (req, res) {
    const user_id = req.user.dataValues.user_id;
    const classes = await getClass(user_id);

    let selected_class = req.query.class_id;
    if (typeof selected_class == "undefined") {
        if (classes.length > 0 ) selected_class = classes[0].klasa_id;
        else selected_class = 0;
    }

    let selected_date = req.query.attendance_date;
    if (!selected_date) {
        let current_day = new Date();
        selected_date = current_day.toISOString().split("T")[0];
    }

    let date = new Date(selected_date);
    let selected_day = ["Niedziela","Poniedzialek","Wtorek","Sroda","Czwartek","Piatek","Sobota"][date.getDay()];

    const [subjects] = await sequelize.query(`
        SELECT zajecia_id, przedmioty.nazwa 
        FROM zajecia
        NATURAL JOIN przedmioty
        NATURAL JOIN data_zajec
        WHERE prowadzacy_id = ? AND klasa_id = ? AND dzien= ?
    `, {
        replacements: [user_id, selected_class, selected_day]
    });

    const temp = new Set();
    const filtered_subjects = subjects.filter((el) => {
        const duplicate = temp.has(el.nazwa);
        temp.add(el.nazwa);
        return !duplicate;
    });

    // TODO: fix the case of no subjects
    let selected_subject = req.query.subject_id;
    if (typeof selected_subject == "undefined") {
        if (subjects.length == 0) selected_subject = 0;
        else selected_subject = subjects[0].zajecia_id;
    }

    const [classes_numbers] = await sequelize.query(
        `SELECT * FROM zajecia NATURAL JOIN data_zajec WHERE klasa_id= ? AND dzien= ? AND zajecia_id= ?`, {
            replacements: [selected_class, selected_day, selected_subject]
    });

    // TODO: fix the case of no classes numbers
    let selected_classes_number = req.query.classes_number;
    if (typeof selected_classes_number == "undefined") {
        if(classes_numbers.length == 0) selected_classes_number = 0;
        else selected_classes_number = classes_numbers[0].nr_lekcji;
    }

    const [frekwencja] = await sequelize.query(
        `SELECT * FROM frekwencja WHERE zajecia_id=? AND data_zajec= ? AND nr_lekcji= ?`,{
            replacements: [selected_subject, selected_date, selected_classes_number]
    });

    const [students] = await sequelize.query(
        `SELECT * FROM uzytkownik WHERE klasa_id=${selected_class}`, {
            replacements: [selected_class]
    });

    // every student will have a field frekwencja from now on
    const studentsWithAttendance = students.map((student) => {
        const attendance = frekwencja.find(
            (f) => f.user_id === student.user_id
        );
        return {
            ...student,
            frekwencja: attendance ? attendance.frekwencja : "-",
        };
    });

    res.render("teacher/attendance", {
        user: req.user,
        students: studentsWithAttendance,
        date: selected_date,
        classes: classes,
        class_id: selected_class,
        subjects: filtered_subjects,
        subject_id: selected_subject,
        classes_numbers: classes_numbers,
        class_number: selected_classes_number,
        current_path: 'attendance',
        count_notif: await count_notif(req.user.dataValues.user_id)
    });
});

router.post("/attendance", async (req, res) => {
    const attendance_list = Object.entries(req.body)
        .filter(
            ([key]) =>
                key !== "zajecia_id" && key !== "date" && key !== "nr_lekcji" && key !== "klasa_id"
        )
        .map(([id, value]) => ({ user_id: id, frekwencja: value }));

    await attendance_list.forEach((item) => {
        frekwencja
            .findOne({
                where: {
                    user_id: item.user_id,
                    data_zajec: req.body.date,
                    zajecia_id: req.body.zajecia_id,
                    nr_lekcji: req.body.nr_lekcji,
                },
            })
            .then((attendance) => {
                if (attendance) {
                    attendance.update({
                        frekwencja: item.frekwencja,
                    });
                } else {
                    const newAttendance = frekwencja.build({
                        zajecia_id: req.body.zajecia_id,
                        user_id: item.user_id,
                        data_zajec: req.body.date,
                        frekwencja: item.frekwencja,
                        nr_lekcji: req.body.nr_lekcji,
                    });
                    newAttendance.save();
                }
            });
    });

    const query = querystring.stringify({
        class_id: req.body.klasa_id,
        attendance_date: req.body.date,
        subject_id: req.body.zajecia_id,
        classes_number: req.body.nr_lekcji,
    });
    res.redirect(`/teacher/attendance?${query}`);
});

/*
=================
TEACHER GRADES 
=================
*/

router.get("/grades", async function (req, res) {
    if (req.query.user_id) {
        let { user_id, subject_id, grade_value } = req.query;
        if (typeof user_id == "string") user_id = [user_id];

        for (var i = 0; i < user_id.length; i++) {
            await sequelize.query(`
                INSERT INTO oceny 
                (ocena, user_id, zajecia_id)
                VALUES 
                (?, ?, ?)
            `, {
                replacements: [grade_value, user_id[i], subject_id]
            });
            await notification_student(user_id[i], subject_id);
        }
    }
    const classes = await getClass(req.user.dataValues.user_id);
    let class_id = 0, subject_id = 0;
    if (!req.query.class_id && classes.length > 0) class_id = classes[0].klasa_id;
    if(req.query.class_id) class_id = req.query.class_id;
    const subjects = await getSubject(req.user.dataValues.user_id, class_id);

    if (!req.query.subject_id && subjects.length > 0) subject_id = subjects[0].zajecia_id;
    if(req.query.subject_id) subject_id = req.query.subject_id;

    const [students, meta_students] = await sequelize.query(`
        SELECT user_id, imie, nazwisko FROM zajecia 
        NATURAL JOIN uzytkownik
        WHERE zajecia_id = ?
    `, {
        replacements: [subject_id]
    });

    let students_grades = [];

    for (var i = 0; i < students.length; i++) {
        const [temp_grades, metadata_oceny] = await sequelize.query(`
            SELECT ocena FROM oceny 
            NATURAL JOIN zajecia NATURAL JOIN uzytkownik 
            WHERE user_id = ?
            AND zajecia_id = ?
        `, {
            replacements: [students[i].user_id, subject_id]
        });
        const grades = temp_grades.map((grade) => {
            return grade.ocena;
        });
        students_grades.push(grades);
    }

    res.render("teacher/grades", {
        user: req.user,
        classes,
        subjects,
        class_id,
        subject_id,
        students,
        students_grades,
        current_path: 'grades',
        count_notif: await count_notif(req.user.dataValues.user_id)
    });
});

router.get("/grades/edit_grades/:subject_id/:user_id", async (req, res) => {
    const { user_id, subject_id } = req.params;

    const [result, meta] = await sequelize.query(`
        SELECT user_id, zajecia_id, imie, nazwisko, klasa_id, nazwa FROM uzytkownik
        NATURAL JOIN zajecia natural join przedmioty
        WHERE user_id = ? AND zajecia_id = ?
    `, {
        replacements: [user_id, subject_id]
    });

    const [grades, meta_grades] = await sequelize.query(`
        SELECT ocena_id, ocena FROM uzytkownik 
        NATURAL JOIN oceny 
        WHERE user_id = ? AND zajecia_id = ?
    `, {
        replacements: [user_id, subject_id]
    });

    let avg = 0;
    if (grades.length > 0) {
        grades.forEach((grade) => {
            avg += grade.ocena;
        });
    }

    if (avg > 0) avg = avg / grades.length;

    res.render("teacher/edit_grades", {
        user: req.user,
        result: result[0],
        grades,
        avg,
        current_path: 'edit_grades',
        count_notif: await count_notif(req.user.dataValues.user_id)
    });
});

router.post("/grades/edit_grades", async (req, res) => {
    let result = req.body;
    let changed = 0;
    for (var key in result) {
        if (result[key] == "remove") {
            await sequelize.query(`
                DELETE FROM oceny
                WHERE ocena_id = ?
            `, {
                replacements: [key]
            });
            changed = 1;
        } else if (key == "add") {
            if (result[key] > 0) {
                await sequelize.query(`
                    INSERT oceny
                    (ocena, user_id, zajecia_id)
                    values(?, ?, ?)
                `, {
                    replacements: [result[key], result["user_id"], result["subject_id"]]
                });
                changed = 1;
            }
        } else if (/^[0-9]+/.test(key)) {
            await sequelize.query(`
                UPDATE oceny
                SET ocena = ${result[key]}
                WHERE ocena_id = ${key}
            `,{
                replacements: [result[key], key]
            });
            changed = 1;
        }
    }

    if (changed) {
        notification_student(result["user_id"], result["subject_id"]);
    }

    req.flash('success_message', 'Zmiany zostały zapisane');
    res.redirect('/teacher/grades');
});

/*
=================
TEACHER SCHEDULE
=================
*/

router.get("/schedule", async function (req, res) {
    const [result, metadata] = await sequelize.query(
        `SELECT nazwa, dzien, nr_lekcji FROM zajecia 
        NATURAL JOIN data_zajec NATURAL JOIN przedmioty INNER JOIN uzytkownik
        ON prowadzacy_id = user_id 
        WHERE prowadzacy_id = ?`, {
            replacements: [req.user.user_id]
    });

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
        current_path: 'schedule',
        count_notif: await count_notif(req.user.dataValues.user_id)
    });
});

/*
=================
TEACHER HOMEWORKS 
=================
*/

router.get("/homeworks", async function (req, res) {
    const [homeworks, metadata] = await sequelize.query(`
    SELECT zajecia.klasa_id, termin_oddania, tytul, opis, nazwa, zadanie_id FROM zadanie_domowe 
    NATURAL JOIN zajecia NATURAL JOIN przedmioty INNER JOIN uzytkownik AS prowadzacy 
    ON prowadzacy.user_id = prowadzacy_id WHERE prowadzacy.user_id = ?
    `, {
        replacements: [req.user.dataValues.user_id]
});
    const classes = await getClass(req.user.dataValues.user_id);
    let class_id = 0;
    if (classes.length > 0) class_id = classes[0].klasa_id;
    if (req.query.class_id) class_id = req.query.class_id;  

    const subjects = await getSubject(req.user.dataValues.user_id, class_id);

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
        homeworks,
        class_id,
        current_path: 'homeworks',
        count_notif: await count_notif(req.user.dataValues.user_id)
    });
});

router.post("/homeworks", async function (req, res) {
    const { subject_id, deadline, title, description } = req.body;

    if (title != "" && description != "" && deadline != "") {
        await sequelize.query(`
            INSERT INTO zadanie_domowe 
            (zajecia_id, termin_oddania, tytul, opis)
            VALUES 
            (?, ?, ?, ?)
        `, {
            replacements: [subject_id, deadline, title, description]
    });
        notification_class(subject_id);
        req.flash('success_message', 'Praca domowa została dodana');
    }

    if (deadline == '') req.flash('error', 'Nie wybrano terminu');
    if (title == '') req.flash('error', 'Nie wprowadzono tytułu');
    if (description == '') req.flash('error', 'Nie wprowadzono opisu');

	res.redirect('/teacher/homeworks');
});

router.post('/homeworks/delete_homework', async (req, res) => {
    console.log(req.body);
    await sequelize.query(`
        DELETE FROM zadanie_domowe 
        WHERE zadanie_id = ?
    `, {
        replacements: [req.body.to_delete]
});
    req.flash('success_message', 'Praca domowa została usunięta');
    res.redirect('/teacher/homeworks');
});

module.exports = router;
