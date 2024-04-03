const { DataTypes } = require('sequelize');
const sequelize = require('./../config/database')

var FieldOfResearch = sequelize.define('FieldOfResearch', {
    for_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    for_name: {
        type: DataTypes.STRING(256),
        allowNull: false,
    }
}, {
    timestamps: false,
    tableName: 'field_of_researches',
})

module.exports = FieldOfResearch