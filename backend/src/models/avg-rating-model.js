const connection = require('../config/database')

module.exports = {
    getConferenceRating: async (id) => {
        try {
            await connection.connect();
            const sql = `SELECT RATE_ID as rate_id, `
                        + `RATE_WELCOMING AS welcoming, `
                        + `RATE_FEEDBACK AS feedback, `
                        + `RATE_NETWORKING AS networking, `
                        + `RATE_INTERACTION AS interaction, `
                        + `RATE_TOP_PEOPLE AS top_people, `
                        + `RATE_WORTHWHILE AS worth_while, `
                        + `RATE_AVG_RATING AS avg_score `
                        + `FROM dbo.AVG_RATING `
                        + `WHERE CONF_ID = ${id}`
            const result = await connection.request().query(sql)
            return result.recordset;
        } catch (error) {
            console.log(error) 
        }
    },
}