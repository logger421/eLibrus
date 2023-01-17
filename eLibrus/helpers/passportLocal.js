const localStrategy = require('passport-local').Strategy;
const { uzytkownik } = require('../models');

module.exports = function(passport) {
    passport.use(
        new localStrategy({ usernameField: 'username' }, (username, password, done) => {
            uzytkownik.findOne({where: { email: username }}).then(user => {
                if (!user) return done(null, false, {message: 'Dane logowania nie są poprawne'});
                    if(password === user.dataValues.haslo) return done(null, user);
                    else return done(null, false, {message: 'Dane logowania nie są poprawne'})
            }).catch(err => console.log(err))
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.dataValues.user_id);
    });

    passport.deserializeUser((id, done) => {
        uzytkownik.findOne({
            where: {
                user_id: id
            }
        }).then((user, err) => done(err, user));
    })
}