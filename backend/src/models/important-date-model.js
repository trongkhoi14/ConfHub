const { DataTypes } = require('sequelize');
const sequelize = require('./../config/database');

const ImportantDate = sequelize.define('ImportantDate', {
    date_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    date_type: {
        type: DataTypes.STRING,
        // validate: {
        //     isIn: {
        //         args: [['sub', 'noti', 'cmr', 'reg']],
        //         msg: 'Error: invalid value'
        //     }
        // },
        allowNull: false,
        defaultValue: 'Submission'
    },
    date_value: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: new Date()
    },
    status: {
        type: DataTypes.STRING,
        validate: {
            isIn: {
                args: [['new', 'old']],
                msg: 'Error: Invalid value.'
            }
        },
        defaultValue: 'new'
    }
}, {
    timestamps: false,
    tableName: 'important_dates'
});

module.exports = ImportantDate;