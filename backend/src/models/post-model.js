const { DataTypes } = require('sequelize');
const sequelize = require('./../config/database');

const Post = sequelize.define('Post', {
    tid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    post_time: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
    timestamps: false,
    tableName: 'posts'
});

module.exports = Post;