const { DataTypes } = require('sequelize');
const sequelize = require('./../config/database')

var Organization = sequelize.define('Organization', {
    org_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    type: {
        type: DataTypes.STRING(8),
        validate: {
            isIn: {
                args: [['online', 'offline', 'hybrid']],
                msg: 'Error: invalid value'
            }
        },
    },
    location: {
        type: DataTypes.STRING(256),
    },
    conf_date: {
        type: DataTypes.DATEONLY,
    },
    keyword: {
        type: DataTypes.STRING(128),
    }
}, {
    timestamps: false,
    tableName: 'organizations',
})

module.exports = Organization