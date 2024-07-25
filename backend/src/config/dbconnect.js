const sequelize = require('./database');

const dbConnect = async () => {
    try {
        await sequelize.authenticate();
        console.log("DB is connecting!");
        console.log('Models are synchronizing...');
        await sequelize.sync({
            // force: true,
            alter: true
        });
        console.log("All models were synchronized successfully.");

    } catch (e) {
        console.log('Error at connecting to DB');
        throw new Error('Cannot connect to the Database:\n' + e);
    }
}

module.exports = dbConnect;