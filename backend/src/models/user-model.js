const { DataTypes, Model } = require('sequelize');
const sequelize = require('./../config/database');
const settingModel = require('./setting-model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

class User extends Model {
    static async hashPassword(password) {
        const salt = bcrypt.genSaltSync(10);
        return await bcrypt.hash(password, salt);
    }

    async isCorrectPassword(password) {
        return await bcrypt.compare(password, this.password);
    }

    static createPasswordChangedToken() {
        const resetToken = crypto.randomBytes(32).toString('hex');
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
        return resetToken;
    }
};

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nationality: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        validate: {
            isIn: {
                args: [['user', 'admin']],
                msg: 'Error: Invalid value.'
            }
        },
        defaultValue: 'user'
    },
    license: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    passwordChangedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    passwordResetToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    passwordResetExpires: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false
});

User.beforeSave(async (user, options) => {
    if (user.changed('password')) {
        user.password = await User.hashPassword(user.password);
    }
});

User.afterCreate(async (user, options) => {
    await settingModel.bulkCreate([
        { name: process.env.DATA_UPDATE_CYCLE, value: 3, status: true, UserId: user.id },
        { name: process.env.CHANGE_AND_UPDATE, status: true, UserId: user.id },
        { name: process.env.CANCELLED_EVENT, status: true, UserId: user.id },
        { name: process.env.YOUR_UPCOMING_EVENT, status: true, UserId: user.id },
        { name: process.env.AUTO_ADD_EVENT_TO_SCHEDULE, status: true, UserId: user.id }
    ]);
});

module.exports = User;


