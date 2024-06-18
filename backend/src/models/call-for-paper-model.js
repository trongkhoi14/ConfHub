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
        type: DataTypes.TEXT
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    rating: {
        type: DataTypes.DOUBLE
    },
    rank: {
        type: DataTypes.TEXT
    },
    owner: {
        type: DataTypes.TEXT,
        // isIn: {
        //     args: [['admin', 'user', 'crawler']],
        //     msg: 'Error: Invalid value.'
        // },
        defaultValue: "crawler"
    },
    nkey: {
        type: DataTypes.TEXT,
        allowNull: true
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
    },
    view: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    timestamps: false,
    tableName: 'call_for_papers'
});

module.exports = CallForPaper;