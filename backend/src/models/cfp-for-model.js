const { DataTypes } = require('sequelize');
const sequelize = require('../config/database')

var CfpFor = sequelize.define('CfpFor', {
    tid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    }
}, {
    timestamps: false,
    tableName: 'cfp_fors',
})

module.exports = CfpFor