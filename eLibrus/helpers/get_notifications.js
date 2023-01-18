const { sequelize } = require('../models');

const get_notifications = async (user_id) => {
    const [notifications] = await sequelize.query(`
        SELECT * from wiadomosc 
        WHERE odbiorca_id = ${user_id} AND typ = 2 AND usunieta != 1
    `);

    return notifications;
};

module.exports = get_notifications;