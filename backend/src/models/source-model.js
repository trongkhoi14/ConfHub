const { DataTypes } = require('sequelize');
const sequelize = require('./../config/database')

var Source = sequelize.define('Source', {
    src_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    src_name: {
        type: DataTypes.STRING(64),
        allowNull: false,
    }
}, {
    timestamps: false,
    tableName: 'sources',
})

module.exports = Source