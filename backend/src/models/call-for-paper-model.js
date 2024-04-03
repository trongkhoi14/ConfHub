const { DataTypes } = require('sequelize');
const sequelize = require('./../config/database')

var CallForPaper = sequelize.define('CallForPaper', {
    cfp_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    content: {
        type: DataTypes.TEXT,
    },
    link: {
        type: DataTypes.STRING(256), 
    },
    status: {
        type: DataTypes.STRING(16),
        validate: {
            isIn: {
                args: [['valid', 'invalid']],
                msg: 'Error: invalid value'
            }
        },
        defaultValue: 'valid'
    },
    rating: {
        type: DataTypes.DOUBLE,
        defaultValue: 5.0,
    },
    rank: {
        type: DataTypes.STRING(16),
    },
    createdAt: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
    timestamps: false,
    tableName: 'call_for_papers',
})

module.exports = CallForPaper