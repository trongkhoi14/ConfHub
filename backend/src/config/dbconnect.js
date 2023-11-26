const connection = require('./database')

const dbConnect = async () => {
    try {
        await connection.connect();
        //const result = await connection.request().query(`select * from Login`)
        //console.log(result)
        console.log("DB is connecting!")
    } catch (e) {
        console.log('Error at connecting to MongoDB')
        throw new Error('Cannot connect to the Database:\n' + e)
    }
}

module.exports = dbConnect