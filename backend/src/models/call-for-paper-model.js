const { DataTypes } = require('sequelize');
const sequelize = require('./../config/database');

const CallForPaper = sequelize.define('CallForPaper', {
    cfp_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    content: {
        type: DataTypes.TEXT
    },
    link: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    rating: {
        type: DataTypes.DOUBLE
    },
    rank: {
        type: DataTypes.STRING
    },
    owner: {
        type: DataTypes.STRING,
        isIn: {
            args: [['admin', 'user', 'crawler']],
            msg: 'Error: Invalid value.'
        },
        defaultValue: "crawler"
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
    timestamps: false,
    tableName: 'call_for_papers'
});

module.exports = CallForPaper;