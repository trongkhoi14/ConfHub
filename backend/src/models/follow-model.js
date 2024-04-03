const { DataTypes } = require('sequelize');
const sequelize = require('./../config/database')

var Follow = sequelize.define('Follow', {
    tid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
}, {
    timestamps: false,
    tableName: 'follows',
})

module.exports = Follow