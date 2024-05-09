const { DataTypes } = require('sequelize');
const sequelize = require('./../config/database');

const Organization = sequelize.define('Organization', {
    org_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    type: {
        type: DataTypes.STRING,
        validate: {
            isIn: {
                args: [['online', 'offline', 'hybrid']],
                msg: 'Error: invalid value'
            }
        }
    },
    location: {
        type: DataTypes.STRING
    },
    start_date: {
        type: DataTypes.DATEONLY
    },
    end_date: {
        type: DataTypes.DATEONLY
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'new'
    }
}, {
    timestamps: false,
    tableName: 'organizations'
});

// function ()

module.exports = Organization;