const sequelize = require("../models").sequelize;

const change_password = async (user_id, old_pass, new_pass, new_pass_again) => {
    errors = [];
    if (!old_pass) errors.push('Należy podać aktualne hasło');
    if (!new_pass) errors.push('Należy podać nowe hasło');
    if (!new_pass_again) errors.push('Należy potwierdzić nowe hasło');
    if (new_pass !== new_pass_again) errors.push('Nowe hasło i jego potwierdzenie nie są takie same');

    if (errors.length > 0) {
        return [0, errors];
    }

    else {
        const [check] = await sequelize.query(`
            SELECT * from uzytkownik
            WHERE user_id = ? AND haslo = ?
        `, {
            replacements: [user_id, old_pass]
        });
    
        if (check.length == 0) {
            errors.push('Aktualne hasło nie jest poprawne');
            return [ 0, errors];
        }
        else {
            await sequelize.query(`
                UPDATE uzytkownik
                SET haslo = ?
                WHERE user_id = ?
            `, {
                replacements: [new_pass, user_id]
            });
            return [1, ['Hasło zostało pomyślnie zmienione']];
        }
    }
};

module.exports = change_password;