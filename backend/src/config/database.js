const mssql = require('mssql');

const connection = new mssql.ConnectionPool({
    driver: 'SQL Server',
    server: 'KHOI',
    database: 'ABCDElivery',
    user: 'sa',
    password: '123',
    options: {
        encrypt: false,
        enableArithAbort: false,
    },
    connectionTimeout: 300000,
    requestTimeout: 300000,
    pool: {
        idleTimeoutMillis: 300000,
        max: 100
    }
});

module.exports = connection;