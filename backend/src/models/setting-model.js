const { DataTypes } = require('sequelize');
const sequelize = require('./../config/database');

const Setting = sequelize.define('Setting', {
    tid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    value: {
        type: DataTypes.DOUBLE,
        defaultValue: 7
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: false,
    tableName: 'settings'
});

module.exports = Setting;