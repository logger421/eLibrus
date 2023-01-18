const e = require("express");
var express = require("express");
var router = express.Router();
const sequelize = require("../models").sequelize;
const { uzytkownik, rodzicielstwo } = require("../models");
const change_password = require("../helpers/change_pass");
router.get("/", async (req, res) => {
    const [notes, meta] = await sequelize.query(`
		SELECT tytul, tresc FROM ogloszenia
        ORDER BY id DESC
	`);
    res.render("general/home", {
        user: req.user,
        notes,
        current_path: "admin",
    });
});

router.get('/change_password', (req, res) => {
    res.render("general/change_password", {user: req.user, current_path: 'change_password'});
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

    res.redirect('/admin/change_password');
});

router.get("/add_announcement", (req, res) => {
    res.render("admin/add_announcement", {
        user: req.user,
        current_path: "add_ann",
    });
});

router.post("/add_announcement", async (req, res) => {
    const { title, description } = req.body;

    if (!title) req.flash("error", "Nie wprowadzono tytuł ogłoszenia");
    if (!description)
        req.flash("error", "Nie wprowadzono zawartości ogłoszenia");

    if (title && description) {
        await sequelize.query(`
            INSERT INTO ogloszenia (\`tytul\`, \`tresc\`)
            VALUES
            ("${title}", "${description}")
        `);
        req.flash('success_message', 'Ogłoszenie zostało pomyślnie dodane')
    }

    res.redirect("/admin/add_announcement");
});

router.get("/manage_subjects", (req, res) => {
    res.render("admin/manage_subjects", {
        user: req.user,
        current_path: "manage_subjects",
    });
});

router.get("/manage_subjects/create_subject", async (req, res) => {
    const [subjects, meta_subjects] = await sequelize.query(`
        SELECT przedmiot_id, nazwa FROM przedmioty
    `);

    const [teachers, meta_teachers] = await sequelize.query(`
        SELECT user_id, imie, nazwisko FROM uzytkownik
        WHERE rola = 3
    `);

    const [rooms, meta_rooms] = await sequelize.query(`
        SELECT sala_id, nazwa FROM sala
    `);

    const [classes, meta_classes] = await sequelize.query(`
        SELECT klasa_id FROM klasa
    `);

    res.render("admin/create_subject", {
        user: req.user,
        teachers,
        rooms,
        subjects,
        classes,
        current_path: "manage_subjects",
    });
});

router.post("/manage_subjects/create_subject", async (req, res) => {
    const { teacher_id, room_id, subject_id, class_id } = req.body;

    if (!teacher_id) req.flash("error", "Nie wybrano nauczyciela");
    if (!room_id) req.flash("error", "Nie wybrano sali");
    if (!subject_id) req.flash("error", "Nie wybrano przedmiotu");
    if (!class_id) req.flash("error", "Nie wybrano klasy");

    if (teacher_id && room_id && subject_id && class_id) {
        const [check, meta_check] = await sequelize.query(`
            SELECT imie, nazwisko, nazwa FROM zajecia 
            NATURAL JOIN przedmioty INNER JOIN uzytkownik 
            ON uzytkownik.user_id = prowadzacy_id
            WHERE zajecia.klasa_id = ${class_id} AND przedmiot_id = ${subject_id}
        `);
        if (check.length > 0) {
            req.flash(
                "error",
                `${check[0].nazwa} jest już prowadzony w klasie ${class_id} przez nauczyciela: ${check[0].imie} ${check[0].nazwisko}`
            );
        } else {
            await sequelize.query(`
                INSERT INTO zajecia 
                (\`przedmiot_id\`,\`prowadzacy_id\`,\`sala_id\`,\`klasa_id\`)
                VALUES
                (${subject_id}, ${teacher_id}, ${room_id}, ${class_id})
            `);
            req.flash(
                "success_message",
                "Zajęcia zostały dodane pomyślnie, przejdź do zarządzania klasami żeby dodać dzień i numer lekcji"
            );
        }
    }

    res.redirect("/admin/manage_subjects/create_subject");
});

router.get("/manage_subjects/delete_subject", async (req, res) => {
    const [subjects, meta_subjects] = await sequelize.query(`
        SELECT imie, nazwisko, przedmioty.nazwa as przedmiot_nazwa, sala.nazwa as sala_nazwa, zajecia.klasa_id, zajecia_id FROM zajecia 
        INNER JOIN sala ON sala.sala_id = zajecia.sala_id 
        INNER JOIN przedmioty ON przedmioty.przedmiot_id = zajecia.przedmiot_id 
        INNER JOIN uzytkownik ON uzytkownik.user_id = prowadzacy_id
    `);

    res.render("admin/delete_subject", {
        user: req.user,
        subjects,
        current_path: "manage_subjects",
    });
});

router.post("/manage_subjects/delete_subject", async (req, res) => {
    const { to_delete } = req.body;

    if (!to_delete) req.flash("error", "Nie wybrano zajęć");
    else {
        try {
            await sequelize.query(`
                DELETE FROM zajecia 
                WHERE zajecia_id = ${to_delete}
            `);
            req.flash("success_message", "Zajęcia zostały pomyślnie usunięte");
        } catch (e) {
            req.flash(
                "error",
                "Nie można usunąć, zajęcia posiadają datę zajęć lub inne powiązania"
            );
        }
    }
    res.redirect("/admin/manage_subjects/delete_subject");
});

router.get("/manage_classes", (req, res) => {
    res.render("admin/manage_classes", {
        user: req.user,
        current_path: "manage_classes",
    });
});

router.get("/manage_classes/create_class", async (req, res) => {
    const [avilable_teachers, meta_teachers] = await sequelize.query(`
        SELECT imie, nazwisko, user_id FROM uzytkownik 
        WHERE user_id NOT IN 
        (SELECT wychowawca_id FROM klasa) 
        AND rola = 3
    `);
    res.render("admin/create_class", {
        user: req.user,
        teachers: avilable_teachers,
        current_path: "manage_classes",
    });
});

router.post("/manage_classes/create_class", async (req, res) => {
    const { class_id, teacher, year } = req.body;
    if (!class_id) req.flash("error", "Nie wybrano numeru klasy");
    if (!teacher) req.flash("error", "Nie wybrano wychowawcy");
    if (!year) req.flash("error", "Nie wybrano roku rozpoczęcia");

    if (class_id && teacher && year) {
        try {
            await sequelize.query(`
                INSERT INTO klasa 
                VALUES
                (${class_id}, ${teacher})
            `);
            req.flash("success_message", "Klasa została dodana");
        } catch (e) {
            req.flash(
                "error",
                "Numer klasy nie jest poprawny lub jest już zajęty"
            );
        }
    }

    res.redirect("/admin/manage_classes/create_class");
});

router.get("/manage_classes/delete_class", async (req, res) => {
    const [classes, meta_classes] = await sequelize.query(`
        SELECT imie, nazwisko, klasa.klasa_id FROM klasa 
        INNER JOIN uzytkownik 
        ON uzytkownik.user_id = wychowawca_id;
    `);
    res.render("admin/delete_class", {
        user: req.user,
        classes,
        current_path: "manage_classes",
    });
});

router.post("/manage_classes/delete_class", async (req, res) => {
    const { to_delete } = req.body;
    if (!to_delete) {
        req.flash("error", "Nie wybrano numeru klasy");
        res.redirect("/admin/manage_classes/delete_class");
    } else {
        try {
            await sequelize.query(`
                DELETE FROM klasa 
                WHERE klasa_id = ${to_delete}
            `);
            req.flash("success_message", "Klasa została pomyślnie usunięta");
        } catch (e) {
            req.flash(
                "error",
                "Nie można usunąć, klasa posiada zajęcia lub powiązania"
            );
        }
        res.redirect("/admin/manage_classes/delete_class");
    }
});

router.get("/manage_classes/edit_subjects", async (req, res) => {
    const [classes] = await sequelize.query(`
        SELECT klasa_id FROM klasa
    `);
    let class_id = 0;
    if (classes.length > 0) {
        class_id = classes[0].klasa_id;
    }
    if (req.query.class_id) {
        class_id = req.query.class_id;
    }

    const [result, metadata] = await sequelize.query(`
        SELECT nazwa, dzien, nr_lekcji FROM zajecia 
        NATURAL JOIN data_zajec NATURAL JOIN przedmioty 
        WHERE klasa_id = ${class_id}
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

    const [subjects] = await sequelize.query(`
        SELECT zajecia_id, nazwa FROM zajecia 
        NATURAL JOIN przedmioty
        WHERE zajecia.klasa_id = ${class_id}
    `);
    let subject_id;
    if (subjects.length > 0) subject_id = subjects[0].zajecia_id;
    if (req.query.subject_id) subject_id = req.query.subject_id;
    else subject_id = 0;
    res.render("admin/edit_subjects", {
        user: req.user,
        classes,
        current_class: class_id,
        current_subject: subject_id,
        schedule,
        subjects,
        current_path: "manage_classes",
    });
});

router.post("/manage_classes/edit_subjects", async (req, res) => {
    const { class_id, subject_id, day, number, operation } = req.body;

    if (!class_id) req.flash("error", "Nie wybrano klasy");
    if (!subject_id) req.flash("error", "Nie wybrano przedmiotu");
    if (!day) req.flash("error", "Nie wybrano dnia");
    if (!number) req.flash("error", "Nie wybrano numeru lekcji");
    if (!operation) req.flash("error", "Wystąpił błąd");

    if (!class_id || !subject_id || !day || !number || !operation) {
        res.redirect("/admin/manage_classes/edit_subjects");
    } else {
        if (operation == "add") {
            const [check] = await sequelize.query(`
                SELECT * FROM data_zajec 
                NATURAL JOIN zajecia 
                WHERE klasa_id = ${class_id} AND dzien = '${day}' AND nr_lekcji = ${number}
            `);

            if (check.length > 0) {
                req.flash(
                    "error",
                    "W podanym czasie odbywają się inne zajęcia"
                );
                res.redirect(
                    `/admin/manage_classes/edit_subjects?class_id=${class_id}&subject_id=${subject_id}`
                );
            } else {
                await sequelize.query(`
                    INSERT INTO data_zajec 
                    (\`dzien\`,\`nr_lekcji\`,\`zajecia_id\`)
                    VALUES
                    ('${day}', ${number}, ${subject_id})
                `);
                req.flash(
                    "success_message",
                    "Zajęcia zostały pomyślnie dodane"
                );
                res.redirect(
                    `/admin/manage_classes/edit_subjects?class_id=${class_id}&subject_id=${subject_id}`
                );
            }
        } else if (operation == "delete") {
            const [check] = await sequelize.query(`
                SELECT * FROM data_zajec 
                NATURAL JOIN zajecia 
                WHERE zajecia_id = ${subject_id} AND dzien = '${day}' AND nr_lekcji = ${number}
            `);

            if (check.length == 0) {
                req.flash(
                    "error",
                    "W podanym czasie wybrane zajęcia się nie odbywają"
                );
                res.redirect(
                    `/admin/manage_classes/edit_subjects?class_id=${class_id}&subject_id=${subject_id}`
                );
            } else {
                await sequelize.query(`
                    DELETE FROM data_zajec 
                    WHERE zajecia_id = ${subject_id} AND dzien = '${day}' AND nr_lekcji = ${number}
                `);
                req.flash(
                    "success_message",
                    "Zajęcia zostały pomyślnie usunięte"
                );
                res.redirect(
                    `/admin/manage_classes/edit_subjects?class_id=${class_id}&subject_id=${subject_id}`
                );
            }
        } else {
            res.redirect(
                `/admin/manage_classes/edit_subjects?class_id=${class_id}&subject_id=${subject_id}`
            );
        }
    }
});

router.get("/manage_classes/edit_students", async (req, res) => {
    const [classes] = await sequelize.query(`
        SELECT klasa_id FROM klasa
    `);

    let class_id = 0;
    if (classes.length > 0) {
        class_id = classes[0].klasa_id;
    }
    if (req.query.class_id) {
        class_id = req.query.class_id;
    }

    const [students] = await sequelize.query(`
        SELECT user_id, imie, nazwisko, email, YEAR(data_urodzenia) as rocznik, klasa_id FROM uzytkownik 
        WHERE rola = 1 AND (klasa_id = ${class_id} OR klasa_id IS NULL)
    `);

    res.render("admin/edit_students", {
        user: req.user,
        classes,
        current_class: class_id,
        students,
        current_path: "manage_classes",
    });
});

router.post("/manage_classes/edit_students", async (req, res) => {
    let { class_id, student_id } = req.body;

    if (!class_id) {
        req.flash("error", "Nie wybrano klasy");
        res.redirect("/admin/manage_classes/edit_studets");
    }

    if (!student_id) student_id = [0];
    if (typeof student_id == "string") student_id = [student_id];

    await sequelize.query(`
        UPDATE uzytkownik 
        SET klasa_id = NULL
        WHERE rola = 1 AND user_id NOT IN (${student_id.toString()})
    `);

    await sequelize.query(`
        UPDATE uzytkownik 
        SET klasa_id = ${class_id}
        WHERE rola = 1 AND user_id IN (${student_id.toString()})
    `);

    res.redirect("/admin/manage_classes/edit_students");
});

router.get("/manage_users", async (req, res) => {
    console.log(req.query);
    const first_name = req.query.first_name || "";
    const last_name = req.query.last_name || "";
    const email = req.query.email || "";
    const roleMap = {
        uczen: "1",
        rodzic: "2",
        nauczyciel: "3",
    };

    let rola = req.query.account_type || "1,2,3";
    rola = rola != "1,2,3" ? roleMap[rola] || rola : rola;

    const [users] = await sequelize.query(
        `SELECT * from uzytkownik 
    WHERE 
        LOWER(imie) LIKE LOWER("${first_name}%") AND 
        LOWER(nazwisko) LIKE LOWER("${last_name}%") AND
        LOWER(email) LIKE LOWER("${email}%") AND
        rola in (${rola})`
    );

    res.render("admin/manage_users", {
        user: req.user,
        current_path: "manage_users",
        users: users,
        first_name: first_name,
        last_name: last_name,
        email: email,
    });
});

router.get("/create_user", async (req, res) => {
    user_info = {
        first_name: req.query.first_name || "",
        last_name: req.query.last_name || "",
    };

    const [parents] = await sequelize.query(`
        SELECT * from uzytkownik WHERE rola="2"
    `);

    res.render("admin/create_user", {
        user: req.user,
        current_path: "manage_users",
        user_info: user_info,
        parents: parents,
    });
});

router.post("/create_user", (req, res) => {
    let {
        account_type,
        first_name,
        last_name,
        PESEL,
        birthdate,
        city,
        zip_code,
        street,
        house_no,
        parent_email,
    } = req.body;
    console.log(req.body);

    const rola_name =
        account_type == 1
            ? "uczen"
            : account_type == 2
            ? "rodzic"
            : account_type == 3
            ? "nauczyciel"
            : null;

    first_name = req.body.first_name.replace(/^\w/, (c) => c.toUpperCase());
    last_name = req.body.last_name.replace(/^\w/, (c) => c.toUpperCase());
    city = req.body.city.replace(/^\w/, (c) => c.toUpperCase());
    street = req.body.street.replace(/^\w/, (c) => c.toUpperCase());

    // check if zip_code is in the format "dd-ddd"
    const zipCodeRegex = /^\d{2}-\d{3}$/;
    if (!zipCodeRegex.test(zip_code)) {
        req.flash("error", "Kod pocztowy jest niepoprawny");
        res.redirect("/admin/create_user");
    }

    // check if PESEL has 11 digits
    const peselRegex = /^\d{11}$/;
    if (!peselRegex.test(PESEL)) {
        req.flash("error", "Numer PESEL jest niepoprawny");
        res.redirect("/admin/create_user");
    }

    console.log(first_name, last_name);

    const error_messages = [];
    if (!first_name) error_messages.push("Nie wpisano imienia");
    if (!last_name) error_messages.push("Nie wpisano nazwiska");
    if (!PESEL) error_messages.push("Nie wpisano nr PESEL");
    if (!birthdate) error_messages.push("Nie wybrano daty urodzenia");
    if (!city) error_messages.push("Nie wpisano miasta zamieszkania");
    if (!zip_code) error_messages.push("Nie wpisano kodu pocztowego");
    if (!street) error_messages.push("Nie wpisano ulicy");
    if (!house_no) error_messages.push("Nie wpisano numeru mieszkania");
    if (account_type == 1 && !parent_email)
        error_messages.push("Nie wybrano rodzica");

    if (error_messages.length > 0) {
        error_messages.forEach((error) => req.flash("error", error));
        res.redirect("/admin/create_user");
    } else {
        uzytkownik
            .findOne({
                where: {
                    pesel: PESEL,
                },
            })
            .then((user) => {
                if (user) {
                    req.flash(
                        "error",
                        "Użytkownik z tym numerem PESEL już istnieje"
                    );
                    res.redirect("/admin/create_user");
                } else {
                    uzytkownik
                        .findOne({ where: { pesel: PESEL } })
                        .then((user) => {
                            if (user) {
                                req.flash(
                                    "error",
                                    "Użytkownik z tym numerem PESEL już istnieje"
                                );
                                res.redirect("/admin/create_user");
                            } else {
                                uzytkownik
                                    .findOne({
                                        where: {
                                            imie: first_name,
                                            nazwisko: last_name,
                                            rola: account_type,
                                        },
                                    })
                                    .then((user) => {
                                        if (user) {
                                            uzytkownik
                                                .max("user_id")
                                                .then((maxId) => {
                                                    uzytkownik
                                                        .create({
                                                            email: `${first_name}.${last_name}${
                                                                maxId + 1
                                                            }@${rola_name}.dziennikuj.pl`,
                                                            haslo: `${rola_name}123`,
                                                            imie: first_name,
                                                            nazwisko: last_name,
                                                            pesel: PESEL,
                                                            data_urodzenia:
                                                                birthdate,
                                                            miasto: city,
                                                            kod_pocztowy:
                                                                zip_code,
                                                            ulica: street,
                                                            nr_mieszkania:
                                                                house_no,
                                                            rola: account_type,
                                                            aktywny: 1,
                                                        })
                                                        .then((createdUser) => {
                                                            if (
                                                                createdUser.rola ==
                                                                1
                                                            ) {
                                                                uzytkownik
                                                                    .findOne({
                                                                        where: {
                                                                            email: parent_email,
                                                                        },
                                                                    })
                                                                    .then(
                                                                        (
                                                                            parent
                                                                        ) => {
                                                                            if (
                                                                                parent
                                                                            ) {
                                                                                rodzicielstwo
                                                                                    .create(
                                                                                        {
                                                                                            dziecko_id:
                                                                                                createdUser.user_id,
                                                                                            rodzic_id:
                                                                                                parent.user_id,
                                                                                        }
                                                                                    )
                                                                                    .then(
                                                                                        () => {
                                                                                            req.flash(
                                                                                                "success_message",
                                                                                                "Użytkownik został utworzony"
                                                                                            );
                                                                                            res.redirect(
                                                                                                "/admin/create_user"
                                                                                            );
                                                                                        }
                                                                                    )
                                                                                    .catch(
                                                                                        (
                                                                                            err
                                                                                        ) => {
                                                                                            console.log(
                                                                                                err
                                                                                            );
                                                                                            res.redirect(
                                                                                                "/admin/create_user"
                                                                                            );
                                                                                        }
                                                                                    );
                                                                            } else {
                                                                                req.flash(
                                                                                    "error",
                                                                                    "Nie ma takiego rodzica"
                                                                                );
                                                                                res.redirect(
                                                                                    "/admin/create_user"
                                                                                );
                                                                            }
                                                                        }
                                                                    )
                                                                    .catch(
                                                                        (
                                                                            err
                                                                        ) => {
                                                                            console.log(
                                                                                err
                                                                            );
                                                                            res.redirect(
                                                                                "/admin/create_user"
                                                                            );
                                                                        }
                                                                    );
                                                            } else {
                                                                req.flash(
                                                                    "success_message",
                                                                    "Użytkownik został utworzony"
                                                                );
                                                                res.redirect(
                                                                    "/admin/create_user"
                                                                );
                                                            }
                                                        })
                                                        .catch((err) => {
                                                            console.log(err);
                                                            res.redirect(
                                                                "/admin/create_user"
                                                            );
                                                        });
                                                })
                                                .catch((err) => {
                                                    console.log(err);
                                                    res.redirect(
                                                        "/admin/create_user"
                                                    );
                                                });
                                        } else {
                                            uzytkownik
                                                .create({
                                                    email: `${first_name}.${last_name}@${rola_name}.dziennikuj.pl`,
                                                    haslo: `${rola_name}123`,
                                                    imie: first_name,
                                                    nazwisko: last_name,
                                                    pesel: PESEL,
                                                    data_urodzenia: birthdate,
                                                    miasto: city,
                                                    kod_pocztowy: zip_code,
                                                    ulica: street,
                                                    nr_mieszkania: house_no,
                                                    rola: account_type,
                                                    aktywny: 1,
                                                })
                                                .then(() => {
                                                    req.flash(
                                                        "success_message",
                                                        "Użytkownik został utworzony"
                                                    );
                                                    res.redirect(
                                                        "/admin/create_user"
                                                    );
                                                })
                                                .catch((err) => {
                                                    console.log(err);
                                                    res.redirect(
                                                        "/admin/create_user"
                                                    );
                                                });
                                        }
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        res.redirect("/admin/create_user");
                                    });
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                            res.redirect("/admin/create_user");
                        });
                }
            })
            .catch((err) => {
                console.log(err);
                res.redirect("/admin/create_user");
            });
    }
});

module.exports = router;
