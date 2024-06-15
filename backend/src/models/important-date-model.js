const { DataTypes } = require('sequelize');
const sequelize = require('./../config/database');

const ImportantDate = sequelize.define('ImportantDate', {
    date_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    date_type: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    date_value: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    status: {
        type: DataTypes.TEXT,
        defaultValue: 'new'
    }
}, {
    timestamps: false,
    tableName: 'important_dates'
});

module.exports = ImportantDate;