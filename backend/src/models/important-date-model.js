const { DataTypes, DATEONLY } = require('sequelize');
const sequelize = require('./../config/database')

var ImportantDate = sequelize.define('ImportantDate', {
    date_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    date_type: {
        type: DataTypes.STRING(8),
        validate: {
            isIn: {
                args: [['sub', 'noti', 'cmr', 'reg']],
                msg: 'Error: invalid value'
            }
        },
        allowNull: false,
        defaultValue: 'sub'
    },
    date_value: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: new Date()
    },
    keyword: {
        type: DataTypes.STRING(128),
    },
    status: {
        type: DataTypes.STRING(8),
        validate: {
            isIn: {
                args: [['new', 'old']],
                msg: 'Error: invalid value'
            }
        },
        defaultValue: 'new'
    }
}, {
    timestamps: false,
    tableName: 'important_dates',
})

module.exports = ImportantDate