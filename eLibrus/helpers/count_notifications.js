const { sequelize } = require('../models');

const count_notifications = async (user_id) => {
    const [notif] = await sequelize.query(`
        SELECT * FROM wiadomosc
        WHERE typ = '2' AND odbiorca_id = ?
    `, {
        replacements: [user_id]
    }); 

    return notif.length;
}

module.exports = count_notifications;