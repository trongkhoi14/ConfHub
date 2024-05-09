const { DataTypes } = require('sequelize');
const sequelize = require('./../config/database');

const Source = sequelize.define('Source', {
    src_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    src_name: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'sources'
});

module.exports = Source;