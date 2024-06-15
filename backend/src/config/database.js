const { Sequelize } = require('sequelize');
require('dotenv').config();

// const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: 'postgres',
//     logging: false
// });

const sequelize = new Sequelize(process.env.DB_CONN_STR, {
    dialect: 'postgres',
    logging: false,
});

module.exports = sequelize;