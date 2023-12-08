const connection = require('./../config/database')

module.exports = {
    getQuantity: async () => {
        try {
            await connection.connect();
            const result = await connection.request().query(`SELECT COUNT(*) AS value FROM dbo.CONFERENCE`)
            return result.recordset;
        } catch (error) {
            console.log(error) 
        }
    },

    getAllConference: async (skip, size) => {
        try {
            await connection.connect();
            let sql = `SELECT CONF_ID AS conf_id `
                        + `FROM dbo.CONFERENCE `
                        + `ORDER BY CONF_UPDATE_TIME DESC `
                        + `OFFSET ${skip} ROWS FETCH NEXT ${size} ROWS ONLY`
            const result = await connection.request().query(sql)
            return result.recordset;
        } catch (error) {
            console.log(error) 
        }
    },

    getConference: async (id) => {
        try {
            await connection.connect();
            const result = await connection.request().query(`SELECT CONF_ID AS conf_id, `
                                                            + `CONF_NAME AS name, `
                                                            + `CONF_SOURCE AS source, `
                                                            + `CONF_ACRONYM AS acronym, `
                                                            + `CONF_RANK AS rank, `
                                                            + `CONF_DATE AS date, `
                                                            + `CONF_LOCATION AS location, `
                                                            + `CONF_TYPE AS type, `
                                                            + `CONF_IMPACT_FACTOR AS impact_factor, `
                                                            + `CONF_UPDATE_TIME AS update_time `
                                                            + `FROM dbo.CONFERENCE ` 
                                                            + `WHERE CONF_ID = ${id}`)
            return result.recordset;
        } catch (error) {
            console.log(error) 
        }
    },


}