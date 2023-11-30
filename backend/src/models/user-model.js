const connection = require('./../config/database')

module.exports = {
    getAll: async () => {
        try {
            await connection.connect();
            const result = await connection.request().query(`select * from Login`)
            return result.recordset;
        } catch (error) {
            console.log(error)
        }
    },
    followConf: async (idUser, idConf) => {
        try {
            await connection.connect();
            const result = await connection.request().query(`insert into FOLLOW values(${idUser}, ${idConf})`)
            return result.recordset;
        } catch (error) {
            console.log(error)
        }
    },
    unFollowConf: async (idUser, idConf) => {
        try {
            await connection.connect();
            const result = await connection.request().query(`delete from FOLLOW where ID = ${idUser} and CONF_ID = ${idConf}`)
            return result.recordset;
        } catch (error) {
            console.log(error)
        }
    }
}

