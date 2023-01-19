const sequelize = require('../models').sequelize;

async function getClass(id) {
    const [result, meta] = await sequelize.query(`
        SELECT distinct klasa_id FROM zajecia 
        WHERE prowadzacy_id = ?
    `,{
        replacements: [id]
    })
    return result;
};

async function getSubject (id, class_id) {
    const [result, meta] = await sequelize.query(`
        SELECT zajecia_id, przedmioty.nazwa FROM zajecia 
        NATURAL JOIN przedmioty
        WHERE prowadzacy_id = ? AND klasa_id = ?
    `,{
        replacements: [id, class_id]
    })
    return result;
};

module.exports = { getClass, getSubject }