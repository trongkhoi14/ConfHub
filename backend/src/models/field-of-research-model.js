const { DataTypes } = require('sequelize');
const sequelize = require('./../config/database');

const FieldOfResearch = sequelize.define('FieldOfResearch', {
    for_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    for_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'fields_of_research'
});

module.exports = FieldOfResearch;