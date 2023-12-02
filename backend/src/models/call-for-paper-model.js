const connection = require('../config/database')

module.exports = {
    getConferenceCFP: async (id) => {
        try {
            await connection.connect();
            const sql = `SELECT CFP_ID AS cfp_id, `
                        + `CFP_CONTENT AS content, `
                        + `CFP_LINK AS link, ` 
                        + `CFP_NOTE AS note, `
                        + `CFP_IS_LATEST AS is_latest ` 
                        + `FROM dbo.CALL_FOR_PAPER `
                        + `WHERE CONF_ID = ${id}`
            const result = await connection.request().query(sql)
            return result.recordset;
        } catch (error) {
            console.log(error) 
        }
    },
}