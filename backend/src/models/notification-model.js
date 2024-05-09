const { DataTypes, Model } = require('sequelize');
const sequelize = require('./../config/database');

class Notification extends Model {
    constructor(payload) {
        this.title = payload.title
        this.message = payload.message
    }
}

Notification.init({
    tid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.TEXT
    },
    message: {
        type: DataTypes.TEXT
    },
    ctime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    stime: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'Notification',
    timestamps: false,
    tableName: 'notifications'
});

Notification.afterUpdate(async (notification, options) => {
    if (notification.status) notification.stime = new Date();
});

module.exports = Notification;