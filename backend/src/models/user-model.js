const connection = require('./../config/database')

module.exports = {
    getAll: async () => {
        try {
            await connection.connect();
            const result = await connection.request().query(`select * from dbo.account`)
            return result.recordset;
        } catch (error) {
            console.log(error) 
        }
    }
}