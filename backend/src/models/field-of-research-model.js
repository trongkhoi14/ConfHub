const connection = require('../config/database')

module.exports = {
    getAllFOR: async () => {
        try {
            await connection.connect();
            const result = await connection.request().query(`SELECT * FROM dbo.FIELD_OF_RESEARCH`)
            return result.recordset;
        } catch (error) {
            console.log(error) 
        }
    },

    getConferenceFOR: async (id) => {
        try {
            await connection.connect();
            const sql = `SELECT TB2.FOR_NAME AS for_name ` 
                        + `FROM dbo.FOR_CONF TB1, dbo.FIELD_OF_RESEARCH TB2 `
                        + `WHERE TB1.CONF_ID = ${id} AND TB1.FOR_ID = TB2.FOR_ID`
            const result = await connection.request().query(sql)
            return result.recordset;
        } catch (error) {
            console.log(error) 
        }
    },
}