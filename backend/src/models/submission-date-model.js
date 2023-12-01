const connection = require('../config/database')

module.exports = {
    getDetail: async (id) => {
        try {
            await connection.connect();
            const result = await connection.request().query(`SELECT SUB_ID AS sub_id, `
                                                            + `SUB_DATE AS sub_date, `
                                                            + `NOTE AS note `
                                                            + `FROM dbo.SUBMISSION_DATE `
                                                            + `WHERE DATE_ID = '${id}'`)
            return result.recordset;
        } catch (error) {
            console.log(error) 
        }
    }
}