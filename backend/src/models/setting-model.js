const { DataTypes } = require('sequelize');
const sequelize = require('./../config/database');

const Setting = sequelize.define('Setting', {
    tid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    value: {
        type: DataTypes.DOUBLE
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