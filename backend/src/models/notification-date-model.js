const connection = require('../config/database')

module.exports = {
    getDetail: async (id) => {
        try {
            await connection.connect();
            const result = await connection.request().query(`SELECT NOTI_ID AS noti_id, `
                                                            + `NOTI_DATE AS noti_date, `
                                                            + `NOTE AS note `
                                                            + `FROM dbo.NOTIFICATION_DATE `
                                                            + `WHERE DATE_ID = '${id}'`)
            return result.recordset;
        } catch (error) {
            console.log(error) 
        }
    }
}