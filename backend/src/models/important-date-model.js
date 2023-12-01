const connection = require('../config/database')

module.exports = {
    getDetail: async (id) => {
        try {
            await connection.connect();
            const result = await connection.request().query(`SELECT TB1.DATE_ID AS date_id, TB2.DOC_TYPE AS doc_type `
                                                            + `FROM dbo.IMPORTANT_DATE TB1, dbo.DOCUMENT TB2 `
                                                            + `WHERE TB1.DOC_ID = TB2.DOC_ID AND TB1.CONF_ID = '${id}'`)
            return result.recordset;
        } catch (error) {
            console.log(error) 
        }
    }
}