const { uzytkownik, rodzicielstwo } = require("../models");

const link_student_parent = async (createdUser, parent_email, req, res) => {
    try {
        if (createdUser.rola == 1) {
            const parent = await uzytkownik.findOne({
                where: {
                    email: parent_email,
                },
            });
            if (parent) {
                await rodzicielstwo.create({
                    dziecko_id: createdUser.user_id,
                    rodzic_id: parent.user_id,
                });
                req.flash("success_message", "Użytkownik został utworzony");
                res.redirect("/admin/create_user");
            } else {
                req.flash("error", "Nie ma takiego rodzica");
                res.redirect("/admin/create_user");
            }
        } else {
            req.flash("success_message", "Użytkownik został utworzony");
            res.redirect("/admin/create_user");
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = link_student_parent