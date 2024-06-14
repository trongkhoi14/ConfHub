const mongoose = require('mongoose');
require('dotenv').config();

const DB_MONGO_STRING_URI = process.env.MONGO_STRING_URI

const crawlerDBConnect = async () => {
    try {
        mongoose.set('strictQuery', false)
        const conn = await mongoose.connect(DB_MONGO_STRING_URI)
        if (conn.connection.readyState === 1) {
            console.log('DB crawler connection was successfully.');
        } else {
            console.log("DB crawler is connecting!")
        }
    } catch (e) {
        console.log('Error at connecting to MongoDB')
        throw new Error('Cannot crawler connect to the Database:\n' + e)
    }
}

module.exports = crawlerDBConnect