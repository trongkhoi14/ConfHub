const { DataTypes } = require('sequelize');
const sequelize = require('./../config/database')

var Feedback = sequelize.define('Feedback', {
    tid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    content: {
        type: DataTypes.TEXT,
    },
    time: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    welcoming: {
        type: DataTypes.DOUBLE,
        validate: {
            min: 0,
            max: 5
        },
    },
    feedback: {
        type: DataTypes.DOUBLE,
        validate: {
            min: 0,
            max: 5
        },
    },
    networking: {
        type: DataTypes.DOUBLE,
        validate: {
            min: 0,
            max: 5
        },
    },
    interaction: {
        type: DataTypes.DOUBLE,
        validate: {
            min: 0,
            max: 5
        },
    },
    top_people: {
        type: DataTypes.DOUBLE,
        validate: {
            min: 0,
            max: 5
        },
    },
    worthwhile: {
        type: DataTypes.DOUBLE,
        validate: {
            min: 0,
            max: 5
        },
    }
}, {
    timestamps: false,
    tableName: 'feedbacks',
})

module.exports = Feedback