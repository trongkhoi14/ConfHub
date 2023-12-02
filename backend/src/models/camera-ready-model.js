const connection = require('../config/database')

module.exports = {
    getCameraReady: async (id) => {
        try {
            await connection.connect();
            const result = await connection.request().query(`SELECT CAMERA_READY_ID AS cr_id, `
                                                            + `CAMERA_READY_DATE AS cr_date, `
                                                            + `NOTE AS note `
                                                            + `FROM dbo.CAMERA_READY `
                                                            + `WHERE DATE_ID = '${id}'`)
            return result.recordset;
        } catch (error) {
            console.log(error) 
        }
    }
}