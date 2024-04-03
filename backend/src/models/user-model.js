const { DataTypes, Model } = require('sequelize');
const sequelize = require('./../config/database')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

class User extends Model {
    static async hashPassword(password) {
        const salt = bcrypt.genSaltSync(10)
        return await bcrypt.hash(password, salt);
    }

    async isCorrectPassword(password) {
        return await bcrypt.compare(password, this.password);
    }

    static createPasswordChangedToken() {
        const resetToken = crypto.randomBytes(32).toString('hex')
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        this.passwordResetExpires = Date.now() + 15 * 60 * 1000
        return resetToken
    }
}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING(16),
        allowNull: true,
        unique: true
    },
    email: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nationality: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user',
    },
    license: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    receive_noti: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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

module.exports = User;


