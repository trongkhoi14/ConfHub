const { DataTypes } = require('sequelize');
const sequelize = require('./../config/database');

const Conference = sequelize.define('Conference', {
    conf_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    conf_name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    acronym: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'conferences'
})

module.exports = Conference;