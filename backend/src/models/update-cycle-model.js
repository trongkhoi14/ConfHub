const { DataTypes } = require('sequelize');
const sequelize = require('./../config/database');

const UpdateCycle = sequelize.define('UpdateCycle', {
    tid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    cycle: {
        type: DataTypes.INTEGER,
        defaultValue: 7
    },
    period: {
        type: DataTypes.INTEGER,
        defaultValue: 30
    }
}, {
    timestamps: true,
    tableName: 'update_cycle'
});

module.exports = UpdateCycle;